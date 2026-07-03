import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { WhyUs } from "@/components/sections/WhyUs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Zašto mi",
  "Profesionalna oprema, celodnevno snimanje, montaža i lokalno prisustvo u Kruševcu."
);

export default function ZastoMiPage() {
  return (
    <PageShell>
      <WhyUs />
    </PageShell>
  );
}
