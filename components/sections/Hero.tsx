"use client";

import { motion } from "framer-motion";
import { heroStats, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const statIcons: Record<string, React.ReactNode> = {
  camera: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
  ),
  video: (
    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  ),
  drone: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
  ),
  reels: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25" />
  ),
};

export function Hero() {
  return (
    <section
      id="pocetna"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
              {statIcons.camera}
            </svg>
            <span className="h-px w-8 bg-accent/40" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Kruševac · Foto & Video
            </p>
          </div>

          <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Trenutke pretvaramo u{" "}
            <span className="text-gradient-accent">uspomene koje traju</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
            {site.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/kontakt">Zakaži fotografisanje</Button>
            <Button href="/portfolio" variant="ghost">
              Pogledaj galeriju
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                className="glass card-glow rounded-2xl px-4 py-4 text-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto mb-2 h-5 w-5 text-accent">
                  {statIcons[stat.icon]}
                </svg>
                <span className="text-sm font-semibold">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center"
        >
          <div className="logo-glow logo-neon relative rounded-full border-2 border-accent/30 bg-[#05070d]/80 p-6 sm:p-8">
            <Logo size="hero" priority />
          </div>
          <div
            className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(101,227,255,0.35), transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
