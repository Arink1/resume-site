"use client";

import { useState } from "react";

export function LivePreview({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted">
          Live Preview
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:text-accent-light transition-colors"
        >
          Open in new tab ↗
        </a>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-card">
        {/* Fake browser chrome */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-sm border-b border-border flex items-center gap-1.5 px-3 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[10px] font-mono text-muted truncate">
            {url}
          </span>
        </div>

        {!loaded && !errored && (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
            Loading preview…
          </div>
        )}

        {errored && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
            <span className="text-muted text-sm">
              This site blocks iframe embedding.
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light text-sm"
            >
              Open {title} in a new tab →
            </a>
          </div>
        )}

        <iframe
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full pt-8"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  );
}
