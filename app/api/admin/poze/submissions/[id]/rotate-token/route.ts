import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";
import { generateAccessToken, hashAccessToken, defaultTokenExpiry } from "@/lib/wedding-poses/token";
import { getSiteUrl } from "@/lib/env";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const { id } = await params;
  const token = generateAccessToken();
  const admin = createAdminClient();
  const { error } = await admin
    .from("wedding_pose_submissions")
    .update({
      access_token_hash: hashAccessToken(token),
      token_revoked_at: null,
      token_expires_at: defaultTokenExpiry(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    continueUrl: `${getSiteUrl()}/poze/izbor/${token}`,
    token,
  });
}
