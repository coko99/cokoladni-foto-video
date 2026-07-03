import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Services } from "@/components/sections/Services";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Usluge",
  "Foto i video usluge za svadbe, krštenja, rođendane, studio snimanje, dron i reels."
);

export default function UslugePage() {
  return (
    <PageShell>
      <Services />
    </PageShell>
  );
}
