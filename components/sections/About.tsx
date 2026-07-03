import Image from "next/image";
import { site, aboutImage } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="o-nama" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl neon-ring">
              <Image
                src={aboutImage}
                alt="Foto studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover brightness-110 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/60 to-transparent" />
              <div className="glass-strong absolute bottom-6 left-6 rounded-2xl px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-accent">Kruševac</p>
                <p className="font-display text-lg">Since day one</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
          <SectionHeading
            eyebrow={site.aboutEyebrow}
            title={site.aboutTitle}
            align="left"
          />
          <p className="text-base leading-relaxed text-text-muted md:text-lg">
            {site.aboutLead}
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
            {site.about}
          </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: "100+", label: "Događaja" },
                { value: "Foto & Video", label: "Kompletan tim" },
                { value: "HD", label: "Isporuka materijala" },
                { value: "Kruševac", label: "Lokalni studio" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass card-glow rounded-2xl px-5 py-4 transition-all duration-400"
                >
                  <p className="font-display text-xl text-accent">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
