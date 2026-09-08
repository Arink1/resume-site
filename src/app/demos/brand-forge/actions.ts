"use server";

import Anthropic from "@anthropic-ai/sdk";

if (process.env.NODE_ENV === "production") {
  throw new Error(
    "Brand Forge generation is local-only. Run with `npm run dev`.",
  );
}

const client = new Anthropic();
const MODEL = "claude-opus-4-7";

const SYSTEM_PROMPT = `You are a senior brand strategist generating brand identities for the "Brand Forge" demo.

Your priorities, in order:
1. Names must be creative and feel intentional — not generic, not AI-slop. Avoid clichés like "Aether", "Lumen", "Vertex", "Nimbus", "Pulse", "Nova" unless they genuinely fit the brief.
2. Names must make sense for the brief. They should evoke the vibe, audience, or industry the user described.
3. Variety. The five candidates should explore different angles (literal / metaphorical / coined / compound / evocative) so the user has real choices.
4. Pronounceable in English. No more than 3 syllables. No awkward consonant clusters.
5. Each name's rationale is one short sentence explaining the angle — no fluff.

For full identities (taglines, palettes, typography, domains):
- Taglines: 3–6 words, no period at the end, no clichés like "redefining the future of X".
- Palettes: 5 hex colors with evocative names. Include a deep anchor, a hero accent, a soft neutral, a warm or cool counterpoint, and a muted tertiary.
- Typography: pair a display face with a body face from real, available typefaces (Google Fonts or common system stacks).
- Domains: invent 3 plausible variants (.com, .co, alt). Mark .com as taken if the name is a real English word; mark coined/compound names' .com as likely available.`;

const namesSchema = {
  type: "object",
  properties: {
    names: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "The brand name itself — title case." },
          rationale: { type: "string", description: "One short sentence: why this name fits the brief." },
        },
        required: ["name", "rationale"],
        additionalProperties: false,
      },
    },
  },
  required: ["names"],
  additionalProperties: false,
} as const;

const identitySchema = {
  type: "object",
  properties: {
    tagline: { type: "string" },
    palette: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hex: { type: "string", description: "7-char hex like #1A2B3C" },
          name: { type: "string", description: "Evocative color name, 1-2 words" },
        },
        required: ["hex", "name"],
        additionalProperties: false,
      },
    },
    typography: {
      type: "object",
      properties: {
        display: { type: "string" },
        body: { type: "string" },
      },
      required: ["display", "body"],
      additionalProperties: false,
    },
    domains: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          available: { type: "boolean" },
        },
        required: ["name", "available"],
        additionalProperties: false,
      },
    },
  },
  required: ["tagline", "palette", "typography", "domains"],
  additionalProperties: false,
} as const;

export type NameCandidate = { name: string; rationale: string };
export type BrandIdentity = {
  tagline: string;
  palette: { hex: string; name: string }[];
  typography: { display: string; body: string };
  domains: { name: string; available: boolean }[];
};

export async function generateNames(prompt: string): Promise<NameCandidate[]> {
  const trimmed = prompt.trim();
  if (!trimmed) throw new Error("Prompt is required");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: namesSchema },
    },
    messages: [
      {
        role: "user",
        content: `Brief: ${trimmed}\n\nGenerate exactly 5 brand name candidates. Maximize variety across the 5 — different angles, different lengths, different feels.`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text response");
  const parsed = JSON.parse(text.text) as { names: NameCandidate[] };
  return parsed.names.slice(0, 5);
}

export async function generateIdentity(
  prompt: string,
  chosenName: string,
): Promise<BrandIdentity> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: identitySchema },
    },
    messages: [
      {
        role: "user",
        content: `Brief: ${prompt.trim()}\n\nChosen brand name: ${chosenName}\n\nGenerate the full identity for this name: tagline, 5-color palette, typography pair, and 3 domain variants.`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text response");
  const parsed = JSON.parse(text.text) as BrandIdentity;
  return {
    ...parsed,
    palette: parsed.palette.slice(0, 5),
    domains: parsed.domains.slice(0, 3),
  };
}
