import { processContactCta, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";

export function ProcessContactCta() {
  return (
    <section className="relative pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="glass-strong relative overflow-hidden rounded-[20px] border border-white/5">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 20%, rgba(101,227,255,0.2), transparent 50%)",
              }}
            />

            <div className="relative grid lg:grid-cols-2 lg:gap-0">
              <div className="relative min-h-[280px] overflow-hidden lg:min-h-full">
                <img
                  src={processContactCta.image}
                  alt={processContactCta.imageAlt}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#05070D]/30 lg:to-[#05070D]/90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                  <p className="font-display text-lg font-medium text-white">
                    Ti uživaj u svom danu. Mi čuvamo priču.
                  </p>
                </div>
              </div>

              <div className="relative p-6 md:p-10 lg:p-12">
                <SectionHeading
                  eyebrow={processContactCta.eyebrow}
                  title={processContactCta.title}
                  subtitle={processContactCta.subtitle}
                  align="left"
                  className="mb-8"
                />

                <div className="mb-6 hidden rounded-[20px] border border-accent/20 bg-accent/5 px-5 py-4 lg:block">
                  <p className="font-display text-base font-medium italic text-accent">
                    Ti uživaj u svom danu. Mi čuvamo priču.
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-[#05070d]/60 p-5 backdrop-blur-sm md:p-7">
                  <h3 className="mb-5 font-display text-lg font-medium">
                    Pošalji upit
                  </h3>
                  <ContactForm />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={site.phoneHref} variant="ghost">
                    Pozovi odmah
                  </Button>
                  <Button href={site.instagram} variant="ghost" external>
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
