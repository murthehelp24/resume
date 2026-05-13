"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const TILE_IMAGES = {
  education:
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
  work:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
  location:
    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1200&auto=format&fit=crop",
  mindset:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
} as const;

type TileKey = keyof typeof TILE_IMAGES;

export function About() {
  const [activeTile, setActiveTile] = useState<TileKey | null>(null);
  const currentImage = activeTile ? TILE_IMAGES[activeTile] : TILE_IMAGES.default;

  return (
    <section
      id="about"
      className="mx-auto max-w-5xl px-4 pb-32 pt-0"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold sm:text-5xl md:text-6xl">
          About <span className="text-gradient-shimmer">Me</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-[9rem_auto_9rem]">
        {/* Mobile: Name card */}
        <article className="md:hidden col-span-1 row-span-1 rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Profile</p>
          <h3 className="mt-2 text-3xl font-black leading-[1.05]">ART</h3>
          <p className="mt-2 text-xs text-(--muted)">Full Stack Developer</p>
        </article>

        {/* Mobile: photo */}
        <article className="md:hidden aspect-square overflow-hidden rounded-2xl border border-(--card-border)">
          <Image
            src={TILE_IMAGES.default}
            alt="About"
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </article>

        {/* Desktop: Name card */}
        <article className="hidden md:flex col-span-1 row-span-1 rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-7">
          <div className="flex w-full flex-col justify-center text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Profile</p>
            <h3 className="mt-2 text-4xl font-black leading-[1.05]">ART</h3>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-(--muted)">
              Full Stack Developer
            </p>
          </div>
        </article>

        {/* Education */}
        <article
          onMouseEnter={() => setActiveTile("education")}
          onMouseLeave={() => setActiveTile(null)}
          className="col-span-2 row-span-1 rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-5 transition-all duration-200 hover:border-violet-400/40"
        >
          <h3 className="text-sm font-bold uppercase text-(--foreground)">
            🎓 Education
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-(--muted) sm:text-sm">
            Studying Computer Science or IT — always learning new things and
            hands-on with real projects.
          </p>
        </article>

        {/* Craft */}
        <article
          onMouseEnter={() => setActiveTile("work")}
          onMouseLeave={() => setActiveTile(null)}
          className="col-span-1 row-span-2 rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-5 md:col-start-3 md:row-start-2 transition-all duration-200 hover:border-violet-400/40"
        >
          <h3 className="text-sm font-bold">🛠️ Stack</h3>
          <p className="mt-2 text-xs leading-relaxed text-(--muted) sm:text-sm">
            Love shipping real products, focusing on clean code and great user experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "Prisma", "Tailwind"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 px-2 py-1 text-[10px] text-(--muted)"
              >
                {t}
              </span>
            ))}
          </div>
        </article>

        {/* Location */}
        <article
          onMouseEnter={() => setActiveTile("location")}
          onMouseLeave={() => setActiveTile(null)}
          className="col-span-1 row-span-1 h-full min-h-[9rem] rounded-2xl border border-(--card-border) overflow-hidden relative transition-all duration-200 hover:border-violet-400/40"
        >
          <Image
            src={TILE_IMAGES.location}
            alt="Bangkok"
            fill
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-3">
            <p className="text-xl font-bold leading-none">Bangkok</p>
            <p className="text-[11px] text-(--muted)">GMT+7</p>
          </div>
        </article>

        {/* Mindset */}
        <article
          onMouseEnter={() => setActiveTile("mindset")}
          onMouseLeave={() => setActiveTile(null)}
          className="col-span-1 row-span-2 rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-5 md:col-start-1 md:row-start-2 transition-all duration-200 hover:border-violet-400/40"
        >
          <h3 className="text-sm font-bold">💡 Mindset</h3>
          <p className="mt-2 text-xs leading-relaxed text-(--muted) sm:text-sm">
            Believe in consistency, ownership, and learning fundamentals first.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={TILE_IMAGES.mindset}
              alt="Mindset"
              width={700}
              height={900}
              className="h-44 w-full object-cover"
            />
          </div>
        </article>

        {/* Desktop: center animated photo */}
        <article className="hidden md:block aspect-square col-start-2 row-start-2 rounded-2xl border border-(--card-border) overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt="Center"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </section>
  );
}
