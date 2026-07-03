import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Portfolio } from "@/components/sections/Portfolio";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Portfolio",
  "Pogledajte naše radove — svadbe, krštenja, rođendani, studio i dron snimanje."
);

export default function PortfolioPage() {
  return (
    <PageShell>
      <Portfolio />
    </PageShell>
  );
}
