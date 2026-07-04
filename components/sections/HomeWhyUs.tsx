import { homeWhyUsBenefits } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceCard";

export function HomeWhyUs() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading title="Ne radimo šablonski. Svako veselje ima svoju priču." />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeWhyUsBenefits.map((benefit, i) => (
            <FadeIn key={benefit.id} delay={i * 0.06}>
              <div className="glass card-glow flex items-center gap-4 rounded-[20px] p-5 transition-all duration-400">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ServiceIcon icon={benefit.icon} />
                </div>
                <p className="text-sm font-medium leading-snug text-text-primary md:text-base">
                  {benefit.title}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
