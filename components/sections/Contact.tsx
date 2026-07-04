import Image from "next/image";
import { site, contactBgImage } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { SocialNeonLinks } from "@/components/ui/SocialNeonLinks";

export function Contact() {
  return (
    <section id="kontakt" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="glass-strong relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16">
            <Image
              src={contactBgImage}
              alt=""
              fill
              sizes="100vw"
              className="scale-105 object-cover object-left blur-[6px] brightness-[0.45]"
              aria-hidden
            />
            <div className="absolute inset-0 bg-[#05070D]/82" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#05070D]/90 via-[#004AAD]/10 to-[#05070D]/88" />

            <div className="relative grid gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-2">
                <SectionHeading
                  eyebrow="Kontakt"
                  title="Rezerviši datum za svoj poseban trenutak."
                  subtitle="Popunite formular — proverićemo dostupnost i javićemo vam se sa ponudom."
                  align="left"
                  className="mb-8 md:mb-10"
                />

                <div className="mt-8 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent">Telefon</p>
                    <a
                      href={site.phoneHref}
                      className="mt-1 block text-lg font-medium transition hover:text-accent"
                    >
                      {site.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent">Email</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1 block text-lg font-medium transition hover:text-accent"
                    >
                      {site.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent">Lokacija</p>
                    <p className="mt-1 text-lg font-medium">{site.location}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent">Društvene mreže</p>
                    <SocialNeonLinks className="mt-3" />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={site.phoneHref}>Pozovi odmah</Button>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-white/10 bg-[#05070d]/60 p-6 backdrop-blur-sm md:p-8">
                  <h3 className="mb-6 font-display text-xl font-medium text-white">
                    Pošalji upit
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
