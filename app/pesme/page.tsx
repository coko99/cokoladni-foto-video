import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Songs } from "@/components/sections/Songs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Pesme za veselja",
  "Preporuke pesama za mladu, mladoženja, venčanje, krštenje i rođenje deteta."
);

export default function PesmePage() {
  return (
    <PageShell>
      <Suspense>
        <Songs />
      </Suspense>
    </PageShell>
  );
}
