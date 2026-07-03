import { whyUsFeatures } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceCard";

export function WhyUs() {
  return (
    <section id="zasto-mi" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Zašto mi"
            title="Zašto izabrati nas"
            subtitle="Profesionalan tim, premium oprema i ličan pristup — od prvog poziva do isporuke materijala."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2">
          {whyUsFeatures.map((feature, i) => (
            <FadeIn key={feature.id} delay={i * 0.08}>
              <div className="glass card-glow flex gap-5 rounded-2xl p-7 transition-all duration-400">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ServiceIcon icon={feature.icon} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
