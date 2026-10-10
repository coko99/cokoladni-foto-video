import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";
import {
  loadSubmissionChecklist,
  loadSubmissionSelections,
} from "@/lib/wedding-poses/db";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const { id } = await params;
  const admin = createAdminClient();
  const { data: submission, error } = await admin
    .from("wedding_pose_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !submission) {
    return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  }

  const [selections, checklist, { data: poses }] = await Promise.all([
    loadSubmissionSelections(id),
    loadSubmissionChecklist(id),
    admin.from("wedding_poses").select("*").order("display_number", { ascending: true }),
  ]);

  const likedIds = selections.filter((s) => s.state === "liked").map((s) => s.pose_id);
  const likedPoses = (poses ?? []).filter((p) => likedIds.includes(p.id));

  return NextResponse.json({
    submission,
    selections,
    checklist,
    likedPoses,
    allPoses: poses ?? [],
  });
}
