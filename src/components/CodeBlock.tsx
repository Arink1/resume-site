"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted">
          Source Code
        </h2>
        {language && (
          <span className="text-xs font-mono text-accent-light uppercase tracking-wider">
            {language}
          </span>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border bg-black/40">
        <button
          onClick={copy}
          className="absolute top-3 right-3 z-10 px-3 py-1 text-xs font-mono bg-accent/20 hover:bg-accent/40 text-accent-light rounded transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>

        <pre className="overflow-x-auto p-5 pr-20 text-sm font-mono leading-relaxed max-h-[600px]">
          <code className="text-foreground/90 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}
