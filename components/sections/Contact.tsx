import Image from "next/image";
import { site, contactBgImage } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <section id="kontakt" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20">
            <Image
              src={contactBgImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#05070D]/90 via-[#004AAD]/20 to-[#05070D]/95" />

            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(101,227,255,0.45), transparent)",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-10 blur-[60px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,74,173,0.5), transparent)",
              }}
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <SectionHeading
                eyebrow="Kontakt"
                title="Rezerviši datum za svoj poseban trenutak."
                subtitle="Pošalji upit i proveri dostupnost termina za svadbu, krštenje, rođendan ili studio fotografisanje."
              />

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button href={site.phoneHref}>Pošalji upit</Button>
                <Button href={site.instagram} variant="ghost" external>
                  Instagram poruka
                </Button>
              </div>

              <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-accent">
                    Telefon
                  </p>
                  <a
                    href={site.phoneHref}
                    className="mt-1 block text-lg font-medium transition-colors duration-400 hover:text-accent"
                  >
                    {site.phone}
                  </a>
                </div>
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-accent">
                    Lokacija
                  </p>
                  <p className="mt-1 text-lg font-medium">{site.location}</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
