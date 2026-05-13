import { siteConfig, socials } from "@/data/config";

export function Hero() {
  return (
    <section
      id="home"
      className="section relative flex min-h-[100svh] items-center overflow-hidden pb-32 pt-24 sm:pt-32 lg:min-h-[112vh]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-6 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="grid w-full items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300 sm:text-sm">
            Portfolio · {siteConfig.title}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Hi, I&apos;m{" "}
            <span className="text-gradient-shimmer">{siteConfig.name}</span>
            <br />
            <span className="text-3xl sm:text-5xl lg:text-6xl text-(--muted)">
              {siteConfig.title}
            </span>
          </h1>
          <p className="max-w-2xl text-base text-(--muted) sm:text-lg">
            {siteConfig.description}. I love building useful and beautiful things
            with Next.js, TypeScript, and Tailwind CSS.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
            >
              View Projects
            </a>
            <a
              href="#about"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              About Me
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            {socials.map((social) => {
              const Icon = social.icon as React.ElementType;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--muted) transition-all duration-200 hover:scale-110 hover:text-(--accent)"
                  aria-label={social.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-(--muted)">
              Tech Stack
            </span>
            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-(--muted)">
              2026
            </span>
          </div>
          <ul className="space-y-2 text-sm text-(--muted)">
            <li>⚡ Next.js + TypeScript + Tailwind CSS</li>
            <li>🗄️ Prisma + SQLite / PostgreSQL</li>
            <li>🔐 Authentication &amp; Authorization</li>
            <li>🚀 Vercel deployment ready</li>
          </ul>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
            <div>
              <p className="text-lg font-bold text-(--foreground)">4+</p>
              <p className="text-[10px] uppercase tracking-wider text-(--muted)">Projects</p>
            </div>
            <div>
              <p className="text-lg font-bold text-(--foreground)">Full</p>
              <p className="text-[10px] uppercase tracking-wider text-(--muted)">Stack</p>
            </div>
            <div>
              <p className="text-lg font-bold text-(--foreground)">TH</p>
              <p className="text-[10px] uppercase tracking-wider text-(--muted)">Bangkok</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
