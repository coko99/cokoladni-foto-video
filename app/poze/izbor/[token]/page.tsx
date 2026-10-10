import { notFound } from "next/navigation";
import { PozeAccessGate } from "@/components/wedding-poses/PozeAccessGate";
import { WeddingPosePlannerApp } from "@/components/wedding-poses/WeddingPosePlannerApp";
import {
  findSubmissionByToken,
  loadActiveCatalog,
  loadSubmissionSelections,
} from "@/lib/wedding-poses/db";
import type { PoseSelectionState } from "@/lib/wedding-poses/types";

export const metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

export default async function PozeIzborPage({ params }: Props) {
  const { token } = await params;
  const submission = await findSubmissionByToken(token);
  if (!submission) notFound();

  const [catalog, selections] = await Promise.all([
    loadActiveCatalog(),
    loadSubmissionSelections(submission.id),
  ]);

  const selectionMap: Record<string, PoseSelectionState> = {};
  for (const s of selections) {
    selectionMap[s.pose_id] = s.state;
  }

  return (
    <PozeAccessGate>
      <WeddingPosePlannerApp
        token={token}
        initialSubmission={submission}
        initialPoses={catalog.poses}
        initialCategories={catalog.categories}
        initialSelections={selectionMap}
        startStep="gallery"
      />
    </PozeAccessGate>
  );
}
