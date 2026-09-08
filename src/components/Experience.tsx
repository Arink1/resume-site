import { Experience as ExperienceType } from "@/lib/types";
import { ScrollReveal } from "./ScrollReveal";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function Experience({
  experiences,
}: {
  experiences: ExperienceType[];
}) {
  const sorted = [...experiences].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="experience" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-2">
            Experience<span className="gradient-text">.</span>
          </h2>
          <div className="w-16 h-1 bg-accent rounded mb-10" />
        </ScrollReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-12">
            {sorted.map((exp, i) => (
              <ScrollReveal
                key={exp.id}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 150}
              >
                <div
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full border-2 border-background -translate-x-1.5 md:-translate-x-1.5 mt-6" />

                  {/* Content */}
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <div
                      className={`bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors ${
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      {exp.start_date && (
                        <span className="text-xs font-mono text-accent-light">
                          {formatDate(exp.start_date)} &mdash;{" "}
                          {exp.end_date ? formatDate(exp.end_date) : "Present"}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold mt-1">
                        {exp.role}
                      </h3>
                      <p className="text-muted text-sm mb-3">{exp.company}</p>
                      <p className="text-muted text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
