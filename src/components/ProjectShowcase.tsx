"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/lib/types";
import Link from "next/link";

function MobilePreview({ project }: { project: Project }) {
  return (
    <div className="lg:hidden mb-6 relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-background">
      {project.iframe_url ? (
        <>
          <div className="absolute top-0 left-0 right-0 h-7 bg-black/50 backdrop-blur-sm border-b border-border flex items-center gap-1.5 px-3 z-10">
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <span className="w-2 h-2 rounded-full bg-green-500/70" />
            <span className="ml-2 text-[10px] font-mono text-muted truncate">
              {project.iframe_url}
            </span>
          </div>
          <iframe
            src={project.iframe_url}
            title={project.title}
            className="absolute inset-0 w-full h-full pt-7"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        </>
      ) : project.image_url ? (
        <img
          src={project.image_url}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-purple-500/10">
          <span className="text-6xl text-muted/20 mb-4">
            {project.title[0]}
          </span>
          <span className="text-sm text-muted/40 font-mono">
            {project.category}
          </span>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({
  project,
  index,
  registerRef,
}: {
  project: Project;
  index: number;
  registerRef: (el: HTMLDivElement | null, index: number) => void;
}) {
  return (
    <div
      ref={(el) => registerRef(el, index)}
      data-project-index={index}
      className="min-h-[70vh] flex items-center py-12"
      style={{ scrollSnapAlign: "center", scrollSnapStop: "normal" }}
    >
      <div className="w-full">
        <MobilePreview project={project} />

        <span className="text-accent font-mono text-sm mb-2 block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          {project.category && (
            <span className="px-2.5 py-1 text-xs font-medium bg-accent/20 text-accent-light rounded-full uppercase tracking-wider">
              {project.category}
            </span>
          )}
        </div>

        <p className="text-muted leading-relaxed mb-5">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {project.tech_stack?.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-mono bg-accent/10 text-accent-light rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.compliance && project.compliance.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.compliance.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {c}
              </span>
            ))}
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <ul className="space-y-2 mb-5">
            {project.features.slice(0, 3).map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <svg
                  className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feat}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-border text-muted hover:text-foreground rounded-lg text-sm transition-colors"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const detailRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const registerRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      detailRefs.current.set(index, el);
    } else {
      detailRefs.current.delete(index);
    }
  };

  useEffect(() => {
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const indexAttr = (entry.target as HTMLElement).dataset.projectIndex;
          if (indexAttr == null) continue;
          const idx = Number(indexAttr);
          ratios.set(idx, entry.intersectionRatio);
        }

        let bestIdx = 0;
        let bestRatio = -1;
        for (const [idx, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = idx;
          }
        }
        if (bestRatio > 0) setActiveIndex(bestIdx);
      },
      {
        threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    detailRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects.length]);

  return (
    <div className="relative">
      <div className="flex gap-8">
        {/* Left: sticky preview */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="sticky top-24 h-[calc(100vh-8rem)] flex items-center">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
              {projects.map((project, i) => {
                const isActive = i === activeIndex;
                const shouldRenderIframe =
                  !!project.iframe_url && Math.abs(i - activeIndex) <= 1;

                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                      zIndex: isActive ? 2 : 1,
                    }}
                  >
                    {shouldRenderIframe ? (
                      <div className="absolute inset-0 bg-card">
                        <div className="absolute top-0 left-0 right-0 h-7 bg-black/50 backdrop-blur-sm border-b border-border flex items-center gap-1.5 px-3 z-10">
                          <span className="w-2 h-2 rounded-full bg-red-500/70" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                          <span className="w-2 h-2 rounded-full bg-green-500/70" />
                          <span className="ml-2 text-[10px] font-mono text-muted truncate">
                            {project.iframe_url}
                          </span>
                        </div>
                        <iframe
                          src={project.iframe_url}
                          title={project.title}
                          className="absolute inset-0 w-full h-full pt-7"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          loading="lazy"
                        />
                      </div>
                    ) : project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                        <span className="text-6xl text-muted/20 mb-4">
                          {project.title[0]}
                        </span>
                        <span className="text-sm text-muted/40 font-mono">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {project.video_url && !shouldRenderIframe && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-accent/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg
                            className="w-6 h-6 text-white ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Progress indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white transition-all duration-300"
                    style={{
                      opacity: i === activeIndex ? 1 : 0.3,
                      transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: scrollable details */}
        <div className="w-full lg:w-1/2">
          {projects.map((project, i) => (
            <ProjectDetail
              key={project.id}
              project={project}
              index={i}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
