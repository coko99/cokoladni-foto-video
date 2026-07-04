"use client";

import { services } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceBanner } from "@/components/ui/ServiceBanner";
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

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {services.map((service, i) => (
            <ServiceBanner
              key={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              index={i}
            />
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center md:mt-16">
            <Button href="/kontakt">Zakaži fotografisanje</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
