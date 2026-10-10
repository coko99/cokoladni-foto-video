import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as { poseId?: string; shot?: boolean };
  const poseId = String(body.poseId ?? "");
  if (!poseId) {
    return NextResponse.json({ error: "Nedostaje ID poze." }, { status: 400 });
  }
  const shot = Boolean(body.shot);
  const now = new Date().toISOString();
  const admin = createAdminClient();
  const { error } = await admin.from("wedding_pose_shot_checklist").upsert(
    {
      submission_id: id,
      pose_id: poseId,
      shot,
      shot_at: shot ? now : null,
      updated_at: now,
    },
    { onConflict: "submission_id,pose_id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
