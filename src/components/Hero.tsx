import { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-background/40" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-accent-light text-sm font-mono mb-4 animate-fade-in-up parallax-slow">
          Hi, my name is
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold mb-4 animate-fade-in-up parallax-slow">
          {profile.name}
          <span className="gradient-text">.</span>
        </h1>
        <h2 className="text-2xl sm:text-4xl font-bold text-muted mb-6 animate-fade-in-up parallax-slow">
          {profile.title}
        </h2>
        <p className="text-lg text-muted max-w-xl mx-auto mb-10 animate-fade-in-up parallax-fast">
          I build and ship production web apps with Next.js, React, and Python:
          multi-tenant SaaS with Stripe and Twilio, lead-generation sites that
          convert, and the Supabase and Django backends behind them. Everything
          here is live and in use.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up parallax-fast">
          <a
            href="#projects"
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors"
          >
            See Projects
          </a>
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-border text-muted hover:text-foreground hover:border-accent/50 rounded-lg font-medium transition-colors"
            >
              GitHub
            </a>
          )}
          <a
            href="#contact"
            className="px-6 py-3 border border-border text-muted hover:text-foreground hover:border-accent/50 rounded-lg font-medium transition-colors"
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
