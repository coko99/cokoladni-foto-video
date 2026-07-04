"use client";

import { motion } from "framer-motion";
import { charlieSection } from "@/lib/content";

export function CharlieSection() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-24 md:min-h-[85vh] md:py-32">
      <div className="absolute inset-0">
        <img
          src={charlieSection.background}
          alt=""
          className="h-full w-full object-cover object-[75%_center] md:object-[70%_center]"
        />
        <div className="absolute inset-0 bg-[#05070D]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/95 via-[#05070D]/70 to-[#05070D]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]/30" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(101,227,255,0.15), transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl md:max-w-2xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Čarli & tim
          </p>

          <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-tight text-text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
            {charlieSection.title}
          </h2>

          <p className="mt-6 text-base leading-relaxed text-text-muted md:text-lg">
            {charlieSection.text}
          </p>

          <div className="mt-8 rounded-[20px] border border-accent/30 bg-[#05070D]/60 px-6 py-5 shadow-[0_0_40px_rgba(101,227,255,0.12)] backdrop-blur-sm">
            <p className="font-display text-lg font-medium italic text-accent md:text-xl">
              &ldquo;{charlieSection.slogan}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
