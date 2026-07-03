"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessStepAnimation } from "@/components/sections/ProcessStepAnimation";

export function Process() {
  return (
    <section id="proces" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Proces"
            title="Kako radimo"
            subtitle="Jednostavan, transparentan proces — od prvog razgovora do isporuke materijala."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass card-glow group relative h-full overflow-hidden rounded-2xl transition-all duration-400"
              >
                <div className="relative overflow-hidden border-b border-accent/10">
                  <ProcessStepAnimation id={step.animation} />
                  <span className="absolute left-4 top-4 font-display text-3xl font-medium text-accent drop-shadow-[0_0_12px_rgba(101,227,255,0.5)]">
                    {step.step}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-xl font-medium">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-accent/25 lg:block" />
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
