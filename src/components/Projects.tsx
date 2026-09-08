"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectShowcase } from "./ProjectShowcase";
import { ScrollReveal } from "./ScrollReveal";

export function Projects({ projects }: { projects: Project[] }) {
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean))
  ).sort();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filtered = categoryFilter
    ? projects.filter((p) => p.category === categoryFilter)
    : projects;

  const showShowcase = !categoryFilter && filtered.length > 1;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-2">
            Projects<span className="gradient-text">.</span>
          </h2>
          <div className="w-16 h-1 bg-accent rounded mb-10" />
        </ScrollReveal>

        {/* Category filter */}
        <ScrollReveal delay={100}>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  !categoryFilter
                    ? "bg-accent text-white"
                    : "bg-card text-muted hover:text-foreground border border-border"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                    categoryFilter === cat
                      ? "bg-accent text-white"
                      : "bg-card text-muted hover:text-foreground border border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Showcase (with sticky preview on desktop, inline preview on mobile) when not filtering */}
        {showShowcase && <ProjectShowcase projects={filtered} />}

        {/* Grid view when filtering or only one project */}
        {!showShowcase && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 100}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-muted py-12">
            No projects found for this category.
          </p>
        )}
      </div>
    </section>
  );
}
