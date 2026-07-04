import { photoVideo } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceCard";

export function PhotoVideo() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading title={photoVideo.title} subtitle={photoVideo.text} />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {photoVideo.columns.map((col, i) => (
            <FadeIn key={col.title} delay={i * 0.1}>
              <div className="glass card-glow h-full rounded-[20px] p-8 md:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ServiceIcon icon={col.icon} />
                </div>
                <h3 className="font-display text-2xl font-medium text-text-primary">
                  {col.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
                  {col.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
