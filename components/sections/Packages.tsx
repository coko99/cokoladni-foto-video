"use client";

import { motion } from "framer-motion";
import { packages } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Packages() {
  return (
    <section id="paketi" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Paketi"
            title="Izaberite iskustvo koje vam odgovara"
            subtitle="Fleksibilni paketi prilagođeni vašem događaju — bez skrivenih troškova, sa jasnom ponudom."
          />
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <FadeIn key={pkg.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-400 ${
                  pkg.highlighted
                    ? "glass-strong card-glow border-accent/30 shadow-[0_0_60px_rgba(101,227,255,0.12)]"
                    : "glass card-glow"
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#05070D]">
                    Preporučeno
                  </span>
                )}

                <h3 className="font-display text-2xl font-medium">{pkg.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {pkg.description}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-text-muted"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href="/kontakt"
                    variant={pkg.highlighted ? "premium" : "ghost"}
                    className="w-full"
                  >
                    Pošalji upit
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
