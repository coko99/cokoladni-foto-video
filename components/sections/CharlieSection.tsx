"use client";

import { motion } from "framer-motion";
import { charlieSection } from "@/lib/content";

export function CharlieSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Mobile — viši kadar, portret pozadina */}
        <div className="relative flex min-h-[70vh] items-end overflow-hidden rounded-[20px] border border-white/5 sm:min-h-[75vh] lg:hidden">
          <img
            src={charlieSection.background}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/75 to-[#05070D]/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/90 via-[#05070D]/45 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full p-6 sm:p-8"
          >
            <CharlieContent />
          </motion.div>
        </div>

        {/* Desktop — 16:9 banner, tekst preko pozadine */}
        <div className="relative hidden aspect-video w-full items-center overflow-hidden rounded-[20px] border border-accent/15 shadow-[0_0_80px_rgba(101,227,255,0.1)] lg:flex">
          <img
            src={charlieSection.imageDesktop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#05070D]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/92 via-[#05070D]/55 to-[#05070D]/15" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 18% 50%, rgba(101,227,255,0.12), transparent 50%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-xl px-10 xl:max-w-2xl xl:px-14"
          >
            <CharlieContent />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CharlieContent() {
  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Čarli & tim
      </p>

      <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-5xl">
        {charlieSection.title}
      </h2>

      <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-muted sm:mt-5 sm:text-base lg:text-[0.95rem] xl:text-lg">
        {charlieSection.text}
      </p>

      <div className="mt-6 max-w-md rounded-[20px] border border-accent/30 bg-[#05070D]/55 px-5 py-4 backdrop-blur-sm sm:mt-7 sm:px-6 sm:py-5">
        <p className="font-display text-base font-medium italic text-accent sm:text-lg xl:text-xl">
          &ldquo;{charlieSection.slogan}&rdquo;
        </p>
      </div>
    </>
  );
}
