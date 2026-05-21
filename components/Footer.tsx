import { Heart, MessageCircle } from "lucide-react";
import { siteConfig, socials } from "@/data/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-black/40 pt-16 pb-8 backdrop-blur-md">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-linear-to-r from-transparent via-(--accent)/30 to-transparent" />
      
      <div className="section">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand & Mission */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter">
                <span className="text-gradient-shimmer">{siteConfig.initials}</span>
              </span>
              <span className="h-4 w-px bg-white/10" />
              <span className="text-sm font-bold uppercase tracking-widest text-(--foreground)">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-(--muted)">
              {siteConfig.description}. Dedicated to creating impactful digital experiences with modern web technologies.
            </p>
          </div>

          {/* Quick Links / Status */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-(--foreground)">
              Status
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-sm text-(--muted)">Available for new projects</span>
            </div>
            <a 
              href="#contact" 
              className="group flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-(--accent)"
            >
              <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
              Let&apos;s talk
            </a>
          </div>

          {/* Socials & Contact */}
          <div className="flex flex-col gap-4 md:items-end">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-(--foreground)">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon as any;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-(--muted) transition-all duration-300 hover:border-(--accent)/30 hover:bg-(--accent)/5 hover:text-(--accent) hover:shadow-lg hover:shadow-(--accent)/10"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-(--muted)">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-(--muted)">
            Built with
            <Heart size={12} className="fill-red-500 text-red-500 animate-pulse" />
            Next.js &amp; Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
