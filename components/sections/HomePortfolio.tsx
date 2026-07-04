"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  homePortfolioCategories,
  homePortfolioItems,
  type HomePortfolioCategory,
} from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function HomePortfolio() {
  const [active, setActive] = useState<HomePortfolioCategory>(
    homePortfolioCategories[0],
  );

  const filtered = homePortfolioItems.filter(
    (item) => item.category === active,
  );

  return (
    <section id="radovi" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            title="Pogledaj kako izgledaju uspomene kroz naš objektiv"
            subtitle="Detalji. Emocije. Svetlo. Pokret. Priča."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {homePortfolioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "border border-accent/30 bg-accent/15 text-accent shadow-[0_0_20px_rgba(101,227,255,0.15)]"
                    : "glass text-text-muted hover:border-white/15 hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/5] overflow-hidden rounded-[20px]"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#05070D]/20 transition-colors duration-300 group-hover:bg-[#05070D]/70" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <FadeIn delay={0.2} className="mt-12 text-center">
          <Button href="/portfolio" variant="ghost">
            Pogledaj celu galeriju
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
