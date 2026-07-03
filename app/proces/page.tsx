import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Process } from "@/components/sections/Process";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Proces",
  "Kako radimo — od prvog razgovora do isporuke materijala."
);

export default function ProcesPage() {
  return (
    <PageShell>
      <Process />
    </PageShell>
  );
}
