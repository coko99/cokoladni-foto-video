import { closingCta, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function ClosingCta() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(101,227,255,0.15), transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-text-primary md:text-4xl lg:text-5xl">
            {closingCta.title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
            {closingCta.text}
          </p>
        </FadeIn>
        <FadeIn delay={0.12}>
          <div className="mt-8 space-y-1 text-sm text-text-muted">
            <p className="font-medium text-text-primary">{closingCta.brand}</p>
            <p>{closingCta.reservations}</p>
            <p>{closingCta.location}</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={site.phoneHref}>{closingCta.callCta}</Button>
            <Button href="/kontakt" variant="ghost">
              {closingCta.messageCta}
            </Button>
            <Button href={site.instagram} variant="ghost" external>
              {closingCta.instagramCta}
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
