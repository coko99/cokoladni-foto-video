"use client";

import { motion } from "framer-motion";
import { homePackages } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HomePackages() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading title="Paketi koji se prilagođavaju tvom danu" />
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {homePackages.map((pkg, i) => (
            <FadeIn key={pkg.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex h-full flex-col rounded-[20px] p-8 transition-all duration-400 ${
                  pkg.highlighted
                    ? "border border-accent/40 bg-[#070b16]/90 shadow-[0_0_60px_rgba(101,227,255,0.15)]"
                    : "glass card-glow border border-white/5"
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#05070D]">
                    Premium
                  </span>
                )}

                <h3 className="font-display text-2xl font-medium">{pkg.name}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                  {pkg.description}
                </p>

                <div className="mt-8">
                  <Button
                    href="/kontakt"
                    variant={pkg.highlighted ? "premium" : "ghost"}
                    className="w-full"
                  >
                    Zatraži ponudu
                  </Button>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
