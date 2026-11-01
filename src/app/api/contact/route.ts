import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Comma-separated; every address gets each message.
const CONTACT_TO_EMAILS = (
  process.env.CONTACT_TO_EMAIL ?? "akinsuranceagent@gmail.com,arin_karabulut9@hotmail.com"
)
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "Arin Karabulut Portfolio <onboarding@resend.dev>";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_PHONE = 64;
const MAX_MESSAGE = 5000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const name = payload.name;
  const message = payload.message;
  // `email` + `phone` are the new shape. Fall back to `contact` (single-field interim) for back-compat.
  const emailRaw = payload.email ?? "";
  const phoneRaw = payload.phone ?? "";
  const contactRaw = payload.contact;

  if (typeof name !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (typeof emailRaw !== "string" || typeof phoneRaw !== "string") {
    return NextResponse.json({ error: "Invalid email or phone" }, { status: 400 });
  }

  const cleanName = name.trim();
  const cleanMessage = message.trim();
  let cleanEmail = emailRaw.trim();
  let cleanPhone = phoneRaw.trim();

  // If a legacy `contact` field came in, route it to email/phone based on shape.
  if (typeof contactRaw === "string" && contactRaw.trim()) {
    const c = contactRaw.trim();
    if (EMAIL_RE.test(c)) {
      cleanEmail = cleanEmail || c;
    } else {
      cleanPhone = cleanPhone || c;
    }
  }

  if (!cleanName || !cleanMessage) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }
  if (!cleanEmail && !cleanPhone) {
    return NextResponse.json(
      { error: "Please provide an email or phone number" },
      { status: 400 }
    );
  }
  if (cleanName.length > MAX_NAME) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }
  if (cleanEmail) {
    if (cleanEmail.length > MAX_EMAIL || !EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
  }
  if (cleanPhone && cleanPhone.length > MAX_PHONE) {
    return NextResponse.json({ error: "Phone number is too long" }, { status: 400 });
  }
  if (cleanMessage.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const resend = new Resend(RESEND_API_KEY);

  const subject = `New portfolio message from ${cleanName}`;
  const textParts = [`From: ${cleanName}`];
  if (cleanEmail) textParts.push(`Email: ${cleanEmail}`);
  if (cleanPhone) textParts.push(`Phone: ${cleanPhone}`);
  textParts.push("", cleanMessage);
  const text = textParts.join("\n");

  const htmlRows: string[] = [
    `<p style="margin: 0 0 4px;"><strong>Name:</strong> ${escapeHtml(cleanName)}</p>`,
  ];
  if (cleanEmail) {
    htmlRows.push(
      `<p style="margin: 0 0 4px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></p>`
    );
  }
  if (cleanPhone) {
    htmlRows.push(
      `<p style="margin: 0 0 4px;"><strong>Phone:</strong> <a href="tel:${escapeHtml(cleanPhone)}">${escapeHtml(cleanPhone)}</a></p>`
    );
  }
  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="margin: 0 0 12px;">New portfolio message</h2>
      ${htmlRows.join("\n      ")}
      <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; background: #f6f8fa; padding: 12px 16px; border-radius: 8px; font-family: -apple-system, system-ui, sans-serif;">${escapeHtml(cleanMessage)}</pre>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAILS,
      subject,
      text,
      html,
      // Only set Reply-To when the visitor gave a real email; phone numbers would break the header.
      ...(cleanEmail ? { replyTo: cleanEmail } : {}),
    });

    if (error) {
      console.error("[contact] Resend send error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
