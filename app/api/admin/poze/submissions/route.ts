import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("wedding_pose_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const submissions = await Promise.all(
    (data ?? []).map(async (s) => {
      const { count } = await admin
        .from("wedding_pose_selections")
        .select("*", { count: "exact", head: true })
        .eq("submission_id", s.id)
        .eq("state", "liked");
      return { ...s, liked_count: count ?? 0 };
    })
  );

  return NextResponse.json({ submissions });
}
