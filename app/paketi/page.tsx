import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Packages } from "@/components/sections/Packages";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Paketi",
  "Premium foto i video paketi prilagođeni vašem događaju."
);

export default function PaketiPage() {
  return (
    <PageShell>
      <Packages />
    </PageShell>
  );
}
