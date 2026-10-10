import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const admin = createAdminClient();
  let query = admin
    .from("wedding_poses")
    .select("*")
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("display_number", { ascending: true });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let poses = data ?? [];
  if (q) {
    const num = Number(q.replace(/\D/g, ""));
    poses = poses.filter((p) =>
      num ? p.display_number === num : String(p.display_number).includes(q)
    );
  }
  return NextResponse.json({ poses });
}

export async function POST(request: Request) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const body = (await request.json()) as {
    storage_path?: string;
    category_id?: string | null;
  };
  const storage_path = String(body.storage_path ?? "").trim();
  if (!storage_path) {
    return NextResponse.json({ error: "Nedostaje putanja slike." }, { status: 400 });
  }
  const admin = createAdminClient();
  const { count } = await admin.from("wedding_poses").select("*", { count: "exact", head: true });
  const { data, error } = await admin
    .from("wedding_poses")
    .insert({
      storage_path,
      thumbnail_path: storage_path,
      category_id: body.category_id ?? null,
      sort_order: (count ?? 0) + 1,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pose: data });
}
