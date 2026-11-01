import { Profile } from "@/lib/types";
import { ScrollReveal } from "./ScrollReveal";

export function About({ profile }: { profile: Profile | null }) {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold mb-2">
            About Me<span className="gradient-text">.</span>
          </h2>
          <div className="w-16 h-1 bg-accent rounded mb-10" />
        </ScrollReveal>

        <div className="max-w-4xl">
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              {(
                profile?.bio ||
                "I am a passionate developer who loves building things for the web."
              )
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph} className="text-muted leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              {profile?.expertise && profile.expertise.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                    Expertise
                  </p>
                  <ul className="space-y-2">
                    {profile.expertise.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-muted leading-relaxed"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
