"use client";

import { useState, useTransition } from "react";
import {
  generateNames,
  generateIdentity,
  type NameCandidate,
  type BrandIdentity,
} from "./actions";

type Stage = "idle" | "loading-names" | "names" | "loading-identity" | "result";

const IS_PREVIEW = process.env.NODE_ENV === "production";

const PREVIEW_NAMES: NameCandidate[] = [
  {
    name: "Hearth & Holm",
    rationale: "Compound that evokes the home and the safe enclosure a candle creates around it.",
  },
  {
    name: "Quill",
    rationale: "Short, tactile English word — feels handmade and intentional, like a small ritual object.",
  },
  {
    name: "Olo",
    rationale: "Coined and palindromic; soft vowels read warm and modern, easy to brand around.",
  },
  {
    name: "Slow North",
    rationale: "Pairs the brand's pace (slow) with a direction the customer is moving toward (north).",
  },
  {
    name: "Suet",
    rationale: "Old English fat used in candlemaking — niche, evocative, and rewards a curious reader.",
  },
];

const PREVIEW_IDENTITY: BrandIdentity = {
  tagline: "Small fires, slow evenings",
  palette: [
    { hex: "#1F1A14", name: "Burnt Oak" },
    { hex: "#C46A3F", name: "Ember" },
    { hex: "#F1E7D3", name: "Tallow" },
    { hex: "#7B8C6F", name: "Sage Smoke" },
    { hex: "#8A6A5A", name: "Hearthstone" },
  ],
  typography: { display: "Fraunces", body: "Inter" },
  domains: [
    { name: "hearthandholm.com", available: false },
    { name: "hearthandholm.co", available: true },
    { name: "holm.candles", available: true },
  ],
};

const PREVIEW_DELAY_MS = 900;

export default function BrandForgeDemo() {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [names, setNames] = useState<NameCandidate[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [identity, setIdentity] = useState<BrandIdentity | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setStage("loading-names");
    if (IS_PREVIEW) {
      setTimeout(() => {
        setNames(PREVIEW_NAMES);
        setStage("names");
      }, PREVIEW_DELAY_MS);
      return;
    }
    startTransition(async () => {
      try {
        const result = await generateNames(prompt);
        setNames(result);
        setStage("names");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed");
        setStage("idle");
      }
    });
  };

  const onPickName = (name: string) => {
    setChosen(name);
    setStage("loading-identity");
    if (IS_PREVIEW) {
      setTimeout(() => {
        setIdentity(PREVIEW_IDENTITY);
        setStage("result");
      }, PREVIEW_DELAY_MS);
      return;
    }
    startTransition(async () => {
      try {
        const result = await generateIdentity(prompt, name);
        setIdentity(result);
        setStage("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed");
        setStage("names");
      }
    });
  };

  const reset = () => {
    setStage("idle");
    setPrompt("");
    setNames([]);
    setChosen(null);
    setIdentity(null);
    setError(null);
  };

  const backToNames = () => {
    setStage("names");
    setChosen(null);
    setIdentity(null);
  };

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="font-semibold tracking-tight">Brand Forge</span>
          <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 border border-white/10 rounded ml-2">
            {IS_PREVIEW ? "PREVIEW" : "LOCAL"}
          </span>
        </div>
        <span className="text-xs text-white/40 font-mono">
          {IS_PREVIEW ? "sample output" : "claude · opus 4.7"}
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {stage === "idle" && (
          <>
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Forge a brand in seconds.
            </h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              Describe your vibe, audience, or industry. Claude proposes five
              brand-name candidates; pick one and it generates the full identity
              — tagline, palette, typography, and domains.
            </p>
            {IS_PREVIEW && (
              <div className="mb-6 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg text-sm text-violet-200">
                Preview mode — the output below is a fixed sample. Real
                generation runs locally.
              </div>
            )}

            <form onSubmit={onGenerate} className="flex flex-col gap-3">
              <input
                autoFocus
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. a warm, minimalist direct-to-consumer candle brand"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-violet-400 placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="self-start px-5 py-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition"
              >
                Generate →
              </button>
            </form>

            {error && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-white/50">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-white font-medium mb-1">Creative</div>
                Five distinct angles per brief.
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-white font-medium mb-1">Grounded</div>
                Each name fits the vibe you describe.
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-white font-medium mb-1">Iterable</div>
                Pick a name to expand its full identity.
              </div>
            </div>
          </>
        )}

        {stage === "loading-names" && (
          <LoadingPanel
            title="Generating names…"
            sub="exploring angles · checking variety · filtering clichés"
          />
        )}

        {stage === "names" && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  Five candidates
                </span>
                <h2 className="text-2xl font-bold tracking-tight mt-1">
                  Pick a name to expand.
                </h2>
              </div>
              <button
                onClick={reset}
                className="text-xs text-white/40 hover:text-white/70 font-mono"
              >
                ← new brief
              </button>
            </div>

            <ul className="space-y-2">
              {names.map((n) => (
                <li key={n.name}>
                  <button
                    onClick={() => onPickName(n.name)}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/50 rounded-lg transition group"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div
                        className="text-2xl font-bold tracking-tight"
                        style={{ fontFamily: "serif" }}
                      >
                        {n.name}
                      </div>
                      <span className="text-xs text-white/30 group-hover:text-violet-300 font-mono transition">
                        Expand →
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1.5 leading-relaxed">
                      {n.rationale}
                    </p>
                  </button>
                </li>
              ))}
            </ul>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {stage === "loading-identity" && (
          <LoadingPanel
            title={`Building ${chosen}…`}
            sub="composing palette · pairing typography · checking domains"
          />
        )}

        {stage === "result" && identity && chosen && (
          <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                Brand Name
              </span>
              <h2
                className="text-6xl font-bold tracking-tight mt-2"
                style={{ fontFamily: "serif" }}
              >
                {chosen}
              </h2>
              <p className="text-xl text-white/60 mt-2 italic">
                {identity.tagline}
              </p>
            </div>

            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                Color Palette
              </span>
              <div className="grid grid-cols-5 gap-3 mt-3">
                {identity.palette.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => copyHex(c.hex)}
                    className="group text-left"
                  >
                    <div
                      className="w-full aspect-square rounded-lg border border-white/10 transition group-hover:scale-[1.02]"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="mt-2 text-xs">
                      <div className="font-medium">{c.name}</div>
                      <div className="font-mono text-white/50">
                        {copied === c.hex ? "Copied ✓" : c.hex}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                Typography
              </span>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-xs text-white/40 font-mono mb-2">
                    Display · {identity.typography.display}
                  </div>
                  <div
                    className="text-4xl font-bold"
                    style={{ fontFamily: "serif" }}
                  >
                    Aa
                  </div>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-xs text-white/40 font-mono mb-2">
                    Body · {identity.typography.body}
                  </div>
                  <div className="text-4xl">Aa</div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                Domain Availability
              </span>
              <ul className="mt-3 space-y-2">
                {identity.domains.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <span className="font-mono text-sm">{d.name}</span>
                    {d.available ? (
                      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-white/5 text-white/40 rounded">
                        Taken
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={backToNames}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition"
              >
                ← Other names
              </button>
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:brightness-110 rounded-lg font-medium transition"
              >
                New brief
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function LoadingPanel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
      <p className="text-white/60 text-sm font-mono">{title}</p>
      <p className="text-white/30 text-xs font-mono">{sub}</p>
    </div>
  );
}
