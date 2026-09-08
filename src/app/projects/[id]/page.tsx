import Link from "next/link";
import type { Metadata } from "next";
import { ProjectMedia } from "@/lib/types";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/MediaGallery";
import { LivePreview } from "@/components/LivePreview";
import { CodeBlock } from "@/components/CodeBlock";
import { projects } from "@/lib/content";
import { site } from "@/lib/site";

function getProject(id: string) {
  const project = projects.find((p) => p.id === id);
  return { project: project || null, media: [] as ProjectMedia[] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { project } = getProject(id);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = project.title;
  const description = project.description || project.long_description || "";
  const url = `${site.url}/projects/${project.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Arin Karabulut",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, media } = getProject(id);

  if (!project) notFound();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-light mb-8 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Live iframe preview */}
        {project.iframe_url && (
          <LivePreview url={project.iframe_url} title={project.title} />
        )}

        {/* Source code snippet */}
        {project.code_snippet && (
          <CodeBlock
            code={project.code_snippet}
            language={project.code_language}
          />
        )}

        {/* Media gallery / hero */}
        <MediaGallery
          media={[
            ...media,
            ...(project.images?.map((url, i) => ({
              id: `img-${i}`,
              project_id: project.id,
              url,
              type: "image" as const,
              caption: "",
              sort_order: i,
            })) ?? []),
          ]}
          heroImage={project.image_url}
          heroVideo={project.video_url}
        />

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          {project.category && (
            <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent-light rounded-full uppercase tracking-wider">
              {project.category}
            </span>
          )}
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm font-mono bg-accent/10 text-accent-light rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-muted hover:text-foreground hover:border-accent/50 rounded-lg transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Source
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Live Demo
            </a>
          )}
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">About This Project</h2>
          <p className="text-muted leading-relaxed text-lg whitespace-pre-line">
            {project.long_description || project.description}
          </p>
        </div>

        {/* Security & Compliance */}
        {((project.compliance && project.compliance.length > 0) ||
          (project.security_features &&
            project.security_features.length > 0)) && (
          <div className="mb-10 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-emerald-400"
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
              <h2 className="text-xl font-semibold">Security &amp; Compliance</h2>
            </div>

            {project.compliance && project.compliance.length > 0 && (
              <div className="mb-5">
                <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Compliance
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.compliance.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 text-sm font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.security_features &&
              project.security_features.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Controls
                  </div>
                  <ul className="space-y-2">
                    {project.security_features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                        </svg>
                        <span className="text-muted text-sm leading-relaxed">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Features list */}
        {project.features && project.features.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
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
                  <span className="text-muted">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
