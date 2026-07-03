"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Gallery() {
  return (
    <section id="galerija" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Galerija"
            title="Naša galerija"
            subtitle="Pogledajte atmosferu, emocije i detalje koje stvaramo na svadbama, proslavama i portretima."
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl neon-border card-glow"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover brightness-110 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs uppercase tracking-widest text-accent">
                    {item.category}
                  </p>
                  <p className="font-display text-lg text-white">{item.title}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
