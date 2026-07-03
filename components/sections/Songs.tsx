"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { songCategories, songsCategoryHref } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SongList } from "@/components/ui/SongList";

export function Songs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(songCategories[0].id);

  useEffect(() => {
    const kategorija = searchParams.get("kategorija");
    if (kategorija && songCategories.some((c) => c.id === kategorija)) {
      setActiveId(kategorija);
    }
  }, [searchParams]);

  const selectCategory = (id: string) => {
    setActiveId(id);
    router.push(songsCategoryHref(id), { scroll: false });
  };

  const activeCategory =
    songCategories.find((c) => c.id === activeId) ?? songCategories[0];

  return (
    <section id="pesme" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Pesme za veselja"
            title="Muzika za vaš poseban dan"
            subtitle="Pregledajte preporuke pesama po prigodi — za mladu, mladoženja, venčanje, krštenje i rođenje deteta."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {songCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat.id)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeId === cat.id
                    ? "border border-accent/40 bg-accent/15 text-accent shadow-[0_0_24px_rgba(101,227,255,0.2)]"
                    : "glass text-text-muted hover:border-accent/30 hover:text-text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="glass-strong neon-border rounded-3xl p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display text-2xl font-medium text-text-primary md:text-3xl">
                  {activeCategory.label}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  {activeCategory.songs.length} pesama u ovoj kategoriji
                </p>

                <SongList songs={activeCategory.songs} />
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
