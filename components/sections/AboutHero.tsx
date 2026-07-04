"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutPage } from "@/lib/content";
import { FloatingNeonPaws } from "@/components/ui/FloatingNeonPaws";

export function AboutHero() {
  return (
    <div className="relative min-h-[68vh] overflow-hidden rounded-b-[28px] sm:min-h-[72vh] lg:min-h-[78vh] lg:rounded-b-[36px]">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={aboutPage.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] brightness-[0.52] saturate-[1.08] sm:object-[68%_center]"
          aria-hidden
        />
      </motion.div>

      <div className="absolute inset-0 bg-[#05070D]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/97 via-[#05070D]/72 to-[#05070D]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]/50" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at 18% 55%, rgba(101,227,255,0.12), transparent 50%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(101,227,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(101,227,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <FloatingNeonPaws />

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-7xl items-center px-5 py-24 sm:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-[11px] font-semibold uppercase tracking-[0.48em] text-accent/75 sm:text-xs"
          >
            Čokoladni Foto & Video
          </motion.p>

          <div className="mt-5 flex items-end gap-3 sm:mt-6 sm:gap-5">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="font-display text-[clamp(4.25rem,13vw,8rem)] font-light leading-[0.85] text-white"
              style={{
                textShadow:
                  "0 0 30px rgba(101,227,255,0.25), 0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              O
            </motion.span>

            <div className="pb-1 sm:pb-3">
              <h1 className="about-neon-word font-display text-[clamp(1.85rem,5.5vw,4rem)] font-medium uppercase leading-none tracking-[0.32em]">
                nama
              </h1>
              <motion.div
                className="mt-4 h-[2px] origin-left bg-gradient-to-r from-accent via-accent/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ maxWidth: "12rem" }}
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-8 max-w-md text-sm leading-relaxed text-text-muted/90 sm:text-base"
          >
            Priča, svetlo i emocija — iza svakog kadra.
          </motion.p>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </div>
  );
}
