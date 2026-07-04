"use client";

import { aboutPage } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { AboutHero } from "@/components/sections/AboutHero";

export function About() {
  return (
    <section id="o-nama" className="relative">
      <AboutHero />

      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:max-w-4xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {aboutPage.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-snug tracking-tight md:text-4xl">
              {aboutPage.name}
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-text-muted md:mt-12 md:text-lg">
            {aboutPage.paragraphs.map((p, i) => (
              <FadeIn key={p.slice(0, 24)} delay={0.06 + i * 0.04}>
                <p>{p}</p>
              </FadeIn>
            ))}

            <FadeIn delay={0.18}>
              <p className="font-display text-lg font-medium text-text-primary md:text-xl">
                {aboutPage.detailsLead}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <ul className="space-y-3 border-l-2 border-accent/40 py-1 pl-5">
                {aboutPage.details.map((line) => (
                  <li key={line} className="text-text-primary">
                    {line}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.24}>
              <div className="grid gap-4 pt-2 md:grid-cols-2 md:gap-5">
                {aboutPage.contrastLines.map((line) => (
                  <p
                    key={line}
                    className="rounded-[16px] border border-accent/25 bg-accent/5 px-5 py-4 font-display text-base font-medium leading-snug text-text-primary md:text-lg"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </FadeIn>

            {aboutPage.story.map((p, i) => (
              <FadeIn key={p.slice(0, 24)} delay={0.28 + i * 0.04}>
                <p>{p}</p>
              </FadeIn>
            ))}

            <FadeIn delay={0.36}>
              <div className="rounded-[20px] border border-accent/25 bg-accent/5 px-6 py-6 md:px-8 md:py-7">
                <h3 className="font-display text-xl font-medium text-accent md:text-2xl">
                  {aboutPage.charlieTitle}
                </h3>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="space-y-1 pt-4 font-display text-xl font-medium text-white md:text-2xl">
                {aboutPage.closing.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-8 space-y-1 border-t border-white/10 pt-8">
                {aboutPage.tagline.map((line, i) => (
                  <p
                    key={line}
                    className={
                      i === 0
                        ? "font-display text-lg font-medium text-accent md:text-xl"
                        : i === 1
                          ? "text-sm uppercase tracking-[0.2em] text-text-muted"
                          : "text-base italic text-text-muted md:text-lg"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
