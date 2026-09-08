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

        <div className="grid md:grid-cols-3 gap-10">
          <ScrollReveal delay={200} className="md:col-span-2">
            <div className="space-y-6">
              <p className="text-muted leading-relaxed text-lg">
                {profile?.bio ||
                  "I am a passionate developer who loves building things for the web."}
              </p>
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

          <ScrollReveal delay={400} direction="right">
            <div className="flex justify-center md:justify-end">
              {profile?.avatar_url ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur" />
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="relative w-48 h-48 rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur" />
                  <div className="relative w-48 h-48 rounded-lg bg-card flex items-center justify-center">
                    <span className="text-6xl text-muted">
                      {(profile?.name || "Y")[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
