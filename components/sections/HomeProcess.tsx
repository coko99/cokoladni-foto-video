import { homeProcessSteps } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HomeProcess() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading title="Kako izgleda naša priča iza kamere" />
        </FadeIn>

        <div className="relative">
          <div
            className="absolute left-8 top-0 hidden h-full w-px bg-accent/20 lg:left-[12.5%] lg:block xl:left-[12.5%]"
            aria-hidden
          />
          <div className="hidden lg:absolute lg:left-[12.5%] lg:right-[12.5%] lg:top-8 lg:block lg:h-px lg:bg-accent/20" />

          <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {homeProcessSteps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.08}>
                <div className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[#070b16] shadow-[0_0_24px_rgba(101,227,255,0.15)] lg:mb-6">
                    <span className="font-display text-xl font-medium text-accent">
                      {step.step}
                    </span>
                  </div>
                  <div className="pb-2 lg:pb-0">
                    <h3 className="font-display text-xl font-medium text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
