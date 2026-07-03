import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { About } from "@/components/sections/About";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "O nama",
  "Upoznajte Čokoladni Foto & Video — premium studio iz Kruševca."
);

export default function ONamaPage() {
  return (
    <PageShell>
      <About />
    </PageShell>
  );
}
