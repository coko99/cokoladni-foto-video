"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/Button";

export function Services() {
  return (
    <section id="usluge" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Usluge"
            title="Naš kadar, vaša priča"
            subtitle="Profesionalno fotografisanje i snimanje venčanja, proslava i porodičnih trenutaka."
          />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.04}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <Button href="/kontakt">Zakaži fotografisanje</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
