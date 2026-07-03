import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Gallery } from "@/components/sections/Gallery";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Galerija",
  "Pogledajte atmosferu, emocije i detalje sa svadbi, proslava i portretnih sesija."
);

export default function GalerijaPage() {
  return (
    <PageShell>
      <Gallery />
    </PageShell>
  );
}
