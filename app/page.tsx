import { Hero } from "@/components/sections/Hero";
import { EmotiveIntro } from "@/components/sections/EmotiveIntro";
import { WhatWeShoot } from "@/components/sections/WhatWeShoot";
import { CharlieSection } from "@/components/sections/CharlieSection";
import { HomeProcess } from "@/components/sections/HomeProcess";
import { HomePortfolio } from "@/components/sections/HomePortfolio";
import { PhotoVideo } from "@/components/sections/PhotoVideo";
import { HomeWhyUs } from "@/components/sections/HomeWhyUs";
import { HomePackages } from "@/components/sections/HomePackages";
import { Testimonials } from "@/components/sections/Testimonials";
import { ClosingCta } from "@/components/sections/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <EmotiveIntro />
      <WhatWeShoot />
      <CharlieSection />
      <HomeProcess />
      <HomePortfolio />
      <PhotoVideo />
      <HomeWhyUs />
      <HomePackages />
      <Testimonials />
      <ClosingCta />
    </>
  );
}
