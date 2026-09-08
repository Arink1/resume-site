"use client";

import { useState, useRef, useEffect } from "react";

type Uploaded = { name: string; url: string };

export default function UploadPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [project, setProject] = useState("sales-crm");
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("upload-password") ?? "";
    if (cached) {
      setPassword(cached);
      setSavedPassword(cached);
    }
  }, []);

  const savePassword = () => {
    sessionStorage.setItem("upload-password", password);
    setSavedPassword(password);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!savedPassword) {
      setError("Enter and save your password first.");
      return;
    }

    setUploading(true);
    setError("");

    const results: Uploaded[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.set("file", file);
      form.set("project", project);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-upload-password": savedPassword },
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          break;
        }
        results.push({ name: file.name, url: data.url });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
        break;
      }
    }

    setUploads((prev) => [...results, ...prev]);
    setUploading(false);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const copyAllForProject = async () => {
    const block = uploads.map((u) => `  "${u.url}",`).join("\n");
    await copy(`images: [\n${block}\n],`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">
          Image Upload<span className="gradient-text">.</span>
        </h1>
        <p className="text-muted mb-8 text-sm">
          Upload images to Vercel Blob. Copy the returned URLs into the{" "}
          <code className="px-1.5 py-0.5 bg-card rounded text-accent-light">
            images
          </code>{" "}
          array in <code className="text-accent-light">sample-data.ts</code>.
        </p>

        {/* Password gate */}
        <div className="mb-6 p-4 bg-card/50 border border-border rounded-xl">
          <label className="block text-sm font-medium mb-2">
            Upload Password
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ADMIN_UPLOAD_PASSWORD"
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-sm"
            />
            <button
              onClick={savePassword}
              className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
            >
              {savedPassword === password && password ? "Saved" : "Save"}
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            Cached in sessionStorage — only for this browser tab.
          </p>
        </div>

        {/* Project slug */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Project slug (folder name)
          </label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="sales-crm"
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-sm"
          />
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragging
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
            }}
          />
          <p className="text-muted">
            {uploading ? "Uploading…" : "Drop images here or click to pick"}
          </p>
          <p className="text-xs text-muted/60 mt-1">
            Images + videos accepted
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        {/* Results */}
        {uploads.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted">
                Uploaded ({uploads.length})
              </h2>
              <button
                onClick={copyAllForProject}
                className="text-xs text-accent hover:text-accent-light transition-colors"
              >
                Copy as images[] array
              </button>
            </div>
            <ul className="space-y-2">
              {uploads.map((u, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                >
                  <img
                    src={u.url}
                    alt={u.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{u.name}</p>
                    <p className="text-xs text-muted truncate font-mono">
                      {u.url}
                    </p>
                  </div>
                  <button
                    onClick={() => copy(u.url)}
                    className="px-3 py-1 text-xs font-mono bg-accent/20 hover:bg-accent/40 text-accent-light rounded transition-colors"
                  >
                    Copy URL
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
