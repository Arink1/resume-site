import { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.name || "Your Name";
  const title = profile?.title || "Full Stack Developer";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-background/40" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-accent-light text-sm font-mono mb-4 animate-fade-in-up parallax-slow">
          Hi, my name is
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold mb-4 animate-fade-in-up parallax-slow">
          {name}
          <span className="gradient-text">.</span>
        </h1>
        <h2 className="text-2xl sm:text-4xl font-bold text-muted mb-6 animate-fade-in-up parallax-slow">
          {title}
        </h2>
        <p className="text-lg text-muted max-w-xl mx-auto mb-10 animate-fade-in-up parallax-fast">
          I build production software for sales teams, healthcare brokers, and
          small businesses. Calling and dialer platforms tuned for higher pickup
          rates and conversions, plus the SaaS, CRM, and AI tooling that wraps
          around them.
        </p>
        <div className="flex items-center justify-center gap-4 animate-fade-in-up parallax-fast">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-accent text-accent hover:bg-accent/10 rounded-lg font-medium transition-colors"
            >
              GitHub
            </a>
          )}
          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors"
            >
              Resume
            </a>
          )}
          <a
            href="#contact"
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 parallax-fade">
        <div className="w-6 h-10 border-2 border-muted rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-muted rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
