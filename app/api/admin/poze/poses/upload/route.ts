import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/wedding-poses/admin-auth";
import { WEDDING_POSES_BUCKET } from "@/lib/wedding-poses/storage";

export const runtime = "nodejs";

const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) {
    return NextResponse.json({ error: "Izaberite fotografije." }, { status: 400 });
  }

  const admin = createAdminClient();
  const uploaded: { storage_path: string; filename: string }[] = [];

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Format nije podržan: ${file.name}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `Prevelik fajl: ${file.name}` }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storage_path = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await admin.storage.from(WEDDING_POSES_BUCKET).upload(storage_path, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      console.error("Pose upload:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    uploaded.push({ storage_path, filename: file.name });
  }

  return NextResponse.json({ uploaded });
}
