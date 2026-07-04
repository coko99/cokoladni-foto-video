import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { About } from "@/components/sections/About";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "O nama",
  "Miloš Mijajlović — Čokoladni Foto & Video, deo brenda Čokoladni Aj-Ti. Priča, pristup i tim iza kadra."
);

export default function ONamaPage() {
  return (
    <PageShell>
      <About />
    </PageShell>
  );
}
