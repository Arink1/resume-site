import { Skill } from "@/lib/types";
import { ScrollReveal } from "./ScrollReveal";

export function Skills({ skills }: { skills: Skill[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-2">
            Skills<span className="gradient-text">.</span>
          </h2>
          <div className="w-16 h-1 bg-accent rounded mb-10" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, catIdx) => (
            <ScrollReveal key={category} delay={catIdx * 100}>
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-accent/30 transition-colors">
                <h3 className="text-lg font-semibold text-accent-light mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === category)
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 text-sm font-mono bg-accent/10 text-accent-light border border-accent/20 rounded-lg"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
