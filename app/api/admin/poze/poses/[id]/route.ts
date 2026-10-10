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
  const body = (await request.json()) as {
    category_id?: string | null;
    sort_order?: number;
    archived?: boolean;
  };
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.category_id !== undefined) patch.category_id = body.category_id;
  if (body.sort_order !== undefined) patch.sort_order = Number(body.sort_order);
  if (body.archived === true) patch.archived_at = new Date().toISOString();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("wedding_poses")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pose: data });
}
