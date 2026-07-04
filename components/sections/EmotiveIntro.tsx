import { emotiveIntro } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";

export function EmotiveIntro() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-text-primary md:text-4xl lg:text-5xl">
            {emotiveIntro.title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-text-muted md:mt-10 md:text-lg md:leading-loose">
            {emotiveIntro.text}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
