"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  portfolioCategories,
  portfolioItems,
  type PortfolioCategory,
} from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Portfolio() {
  const [active, setActive] = useState<PortfolioCategory>("Sve");

  const filtered =
    active === "Sve"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === active);

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Portfolio"
            title="Radovi koji govore sami za sebe"
            subtitle="Pregledajte naš rad — svadbe, krštenja, proslave i studijske sesije u cinematic stilu."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "bg-accent/15 text-accent border border-accent/30 shadow-[0_0_20px_rgba(101,227,255,0.15)]"
                    : "glass text-text-muted hover:text-text-primary hover:border-white/15"
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
                whileHover={{ y: -4 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl transition-shadow duration-400 hover:shadow-[0_0_48px_rgba(101,227,255,0.18)]"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover brightness-110 contrast-105 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-[#05070D]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
                    {item.tag}
                  </span>
                  <h3 className="font-display text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{item.category}</p>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-transparent transition-all duration-400 group-hover:border-accent/35 group-hover:shadow-[inset_0_0_40px_rgba(101,227,255,0.08)]" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
