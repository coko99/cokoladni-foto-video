import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";
import { slugify } from "@/lib/gallery/utils";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("wedding_pose_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  const body = (await request.json()) as { name?: string };
  const name = String(body.name ?? "").trim();
  if (name.length < 2) {
    return NextResponse.json({ error: "Unesite naziv kategorije." }, { status: 400 });
  }
  const admin = createAdminClient();
  const { count } = await admin
    .from("wedding_pose_categories")
    .select("*", { count: "exact", head: true });
  const { data, error } = await admin
    .from("wedding_pose_categories")
    .insert({
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      sort_order: (count ?? 0) + 1,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}
