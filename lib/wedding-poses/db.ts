import { createAdminClient } from "@/lib/supabase/admin";
import { hashAccessToken } from "@/lib/wedding-poses/token";
import type {
  PoseSelectionState,
  WeddingPose,
  WeddingPoseCategory,
  WeddingPoseSubmission,
} from "@/lib/wedding-poses/types";

export async function loadActiveCatalog() {
  const admin = createAdminClient();
  const [{ data: categories }, { data: poses }] = await Promise.all([
    admin
      .from("wedding_pose_categories")
      .select("*")
      .is("archived_at", null)
      .order("sort_order", { ascending: true }),
    admin
      .from("wedding_poses")
      .select("*")
      .is("archived_at", null)
      .order("sort_order", { ascending: true })
      .order("display_number", { ascending: true }),
  ]);
  return {
    categories: (categories ?? []) as WeddingPoseCategory[],
    poses: (poses ?? []) as WeddingPose[],
  };
}

export async function findSubmissionByToken(token: string) {
  const admin = createAdminClient();
  const tokenHash = hashAccessToken(token);
  const { data, error } = await admin
    .from("wedding_pose_submissions")
    .select("*")
    .eq("access_token_hash", tokenHash)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as WeddingPoseSubmission & {
    token_expires_at: string | null;
    token_revoked_at: string | null;
  };

  if (row.token_revoked_at) return null;
  if (row.token_expires_at && new Date(row.token_expires_at) < new Date()) {
    return null;
  }

  return row;
}

export async function loadSubmissionSelections(submissionId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("wedding_pose_selections")
    .select("pose_id, state")
    .eq("submission_id", submissionId);
  return (data ?? []) as { pose_id: string; state: PoseSelectionState }[];
}

export async function loadSubmissionChecklist(submissionId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("wedding_pose_shot_checklist")
    .select("pose_id, shot, shot_at")
    .eq("submission_id", submissionId);
  return (data ?? []) as { pose_id: string; shot: boolean; shot_at: string | null }[];
}

export async function upsertSelections(
  submissionId: string,
  items: { poseId: string; state: PoseSelectionState }[]
) {
  if (!items.length) return;
  const admin = createAdminClient();
  const rows = items.map((item) => ({
    submission_id: submissionId,
    pose_id: item.poseId,
    state: item.state,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await admin.from("wedding_pose_selections").upsert(rows, {
    onConflict: "submission_id,pose_id",
  });
  if (error) throw error;
}

export async function getLikedDisplayNumbers(submissionId: string): Promise<number[]> {
  const admin = createAdminClient();
  const { data: selections } = await admin
    .from("wedding_pose_selections")
    .select("pose_id")
    .eq("submission_id", submissionId)
    .eq("state", "liked");

  const poseIds = (selections ?? []).map((s) => s.pose_id as string);
  if (!poseIds.length) return [];

  const { data: poses } = await admin
    .from("wedding_poses")
    .select("display_number")
    .in("id", poseIds)
    .order("display_number", { ascending: true });

  return (poses ?? []).map((p) => p.display_number as number);
}
