import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";
import { getLikedDisplayNumbers } from "@/lib/wedding-poses/db";
import { notifyPhotographerOfSubmission } from "@/lib/wedding-poses/email";
import type { WeddingPoseSubmission } from "@/lib/wedding-poses/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
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

  const row = submission as WeddingPoseSubmission;
  const displayNumbers = await getLikedDisplayNumbers(id);
  const emailResult = await notifyPhotographerOfSubmission({
    bride_name: row.bride_name,
    groom_name: row.groom_name,
    wedding_date: row.wedding_date,
    city: row.city,
    shoot_location: row.shoot_location,
    celebration_venue: row.celebration_venue,
    note: row.note,
    displayNumbers,
    isUpdate: row.status !== "draft",
  });

  const now = new Date().toISOString();
  await admin.from("wedding_pose_notification_outbox").insert({
    submission_id: id,
    kind: "resend",
    status: emailResult.ok ? "sent" : "failed",
    error: emailResult.error ?? null,
    sent_at: emailResult.ok ? now : null,
  });

  await admin
    .from("wedding_pose_submissions")
    .update({
      email_status: emailResult.ok ? "sent" : "failed",
      email_error: emailResult.error ?? null,
      last_email_sent_at: emailResult.ok ? now : row.last_email_sent_at,
    })
    .eq("id", id);

  if (!emailResult.ok) {
    return NextResponse.json({ error: emailResult.error }, { status: 503 });
  }
  return NextResponse.json({ success: true });
}
