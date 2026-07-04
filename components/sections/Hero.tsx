"use client";

import { motion } from "framer-motion";
import { homeHero } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="pocetna"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0">
        <img
          src={homeHero.backgroundMobile}
          alt=""
          className="h-full w-full object-cover object-[center_75%] md:hidden"
        />
        <img
          src={homeHero.background}
          alt=""
          className="hidden h-full w-full object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-[#05070D]/75" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, rgba(101,227,255,0.18), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {homeHero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            {homeHero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/kontakt">{homeHero.primaryCta}</Button>
            <Button href="/portfolio" variant="ghost">
              {homeHero.secondaryCta}
            </Button>
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-text-dim sm:text-sm">
            {homeHero.tags}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
