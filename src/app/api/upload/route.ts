import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const password = request.headers.get("x-upload-password");
  const expected = process.env.ADMIN_UPLOAD_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Upload is not configured. Set ADMIN_UPLOAD_PASSWORD." },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const projectSlug = (form.get("project") as string | null) ?? "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const sanitizedSlug = projectSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 40);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const path = `projects/${sanitizedSlug}/${timestamp}-${safeName}`;

  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
