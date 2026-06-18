import { siteConfig, socials } from "@/data/config";
import { RobotModel } from "@/components/RobotModel";
import { Typewriter } from "@/components/Typewriter";
import { Download } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="section relative flex min-h-[100svh] items-center overflow-hidden pb-32 pt-24 sm:pt-32 lg:min-h-[112vh]"
    >
      <div className="grid w-full items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-orange-300 sm:text-sm">
            Portfolio · {siteConfig.title}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] text-pretty sm:text-6xl lg:text-7xl">
            Hi, I&apos;m{" "}
            <Typewriter
              words={["Attachai\nJumpahom"]}
              textClassName="text-gradient-shimmer"
            />
            <br />
            <span className="text-2xl sm:text-5xl lg:text-6xl text-(--muted)">
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
              className="rounded-full bg-(--accent) px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-(--accent-hover) hover:shadow-lg hover:shadow-(--accent)/20"
            >
              View Projects
            </a>
            <a
              href="/Resume%20Fullstack%20Ver%200.2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-(--card-border) bg-(--card)/50 px-6 py-2.5 text-sm font-semibold text-(--foreground) transition-all hover:border-(--accent)/40 hover:bg-(--card)"
            >
              <Download size={18} />
              Resume
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            {socials.map((social) => {
              const Icon = social.icon as any;
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

        <div className="flex items-center justify-center">
          <RobotModel />
        </div>
      </div>
    </section>
  );
}
