import { createAdminClient } from "@/lib/supabase/admin";
import {
  getLikedDisplayNumbers,
  loadSubmissionSelections,
} from "@/lib/wedding-poses/db";
import { notifyPhotographerOfSubmission } from "@/lib/wedding-poses/email";
import type { WeddingPoseSubmission } from "@/lib/wedding-poses/types";

export async function finalizeSubmission(
  submission: WeddingPoseSubmission,
  isUpdate: boolean
): Promise<{ ok: true; emailSent: boolean; emailError: string | null } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const displayNumbers = await getLikedDisplayNumbers(submission.id);

  if (!displayNumbers.length) {
    return { ok: false, error: "Izaberite bar jednu fotografiju pre slanja." };
  }

  const now = new Date().toISOString();
  const nextStatus = isUpdate ? "updated" : "submitted";

  const { error: updateError } = await admin
    .from("wedding_pose_submissions")
    .update({
      status: nextStatus,
      submitted_at: submission.submitted_at ?? now,
      updated_at: now,
    })
    .eq("id", submission.id);

  if (updateError) {
    return { ok: false, error: "Čuvanje izbora nije uspelo." };
  }

  const emailInput = {
    bride_name: submission.bride_name,
    groom_name: submission.groom_name,
    wedding_date: submission.wedding_date,
    city: submission.city,
    shoot_location: submission.shoot_location,
    celebration_venue: submission.celebration_venue,
    note: submission.note,
    displayNumbers,
    isUpdate,
  };

  const emailResult = await notifyPhotographerOfSubmission(emailInput);
  const emailStatus = emailResult.ok ? "sent" : "failed";

  await admin.from("wedding_pose_notification_outbox").insert({
    submission_id: submission.id,
    kind: isUpdate ? "updated" : "initial",
    status: emailStatus,
    error: emailResult.error ?? null,
    sent_at: emailResult.ok ? now : null,
  });

  await admin
    .from("wedding_pose_submissions")
    .update({
      email_status: emailStatus,
      email_error: emailResult.error ?? null,
      last_email_sent_at: emailResult.ok ? now : submission.last_email_sent_at,
      updated_at: now,
    })
    .eq("id", submission.id);

  // Ensure checklist rows exist for liked poses
  const selections = await loadSubmissionSelections(submission.id);
  const likedIds = selections.filter((s) => s.state === "liked").map((s) => s.pose_id);
  if (likedIds.length) {
    await admin.from("wedding_pose_shot_checklist").upsert(
      likedIds.map((poseId) => ({
        submission_id: submission.id,
        pose_id: poseId,
        shot: false,
        updated_at: now,
      })),
      { onConflict: "submission_id,pose_id" }
    );
  }

  return {
    ok: true,
    emailSent: emailResult.ok,
    emailError: emailResult.error ?? null,
  };
}
