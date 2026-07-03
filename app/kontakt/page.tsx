import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Contact } from "@/components/sections/Contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Kontakt",
  "Rezervišite termin — pozovite nas ili pišite putem Instagrama."
);

export default function KontaktPage() {
  return (
    <PageShell>
      <Contact />
    </PageShell>
  );
}
