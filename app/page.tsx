import { Suspense } from "react";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Songs } from "@/components/sections/Songs";
import { WhyUs } from "@/components/sections/WhyUs";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Suspense>
        <Songs />
      </Suspense>
      <Gallery />
      <WhyUs />
      <Contact />
    </>
  );
}
