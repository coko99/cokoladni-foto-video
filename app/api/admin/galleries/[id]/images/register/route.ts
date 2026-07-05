import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFilename } from "@/lib/gallery/filename";

type RegisterPayload = {
  filename: string;
  storagePath: string;
  fileSizeBytes?: number;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  let body: RegisterPayload;
  try {
    body = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const filename = sanitizeFilename(body.filename?.trim() ?? "");
  const storagePath = body.storagePath?.trim() ?? "";

  if (!filename || !storagePath) {
    return NextResponse.json({ error: "Nedostaju podaci o slici." }, { status: 400 });
  }

  const expectedPrefix = `${id}/`;
  if (!storagePath.startsWith(expectedPrefix) || storagePath.includes("..")) {
    return NextResponse.json({ error: "Neispravna putanja slike." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: gallery, error: galleryError } = await admin
    .from("galleries")
    .select("id, hero_image_id")
    .eq("id", id)
    .single();

  if (galleryError || !gallery) {
    return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
  }

  const { count } = await admin
    .from("gallery_images")
    .select("*", { count: "exact", head: true })
    .eq("gallery_id", id);

  const fileSizeBytes =
    typeof body.fileSizeBytes === "number" && body.fileSizeBytes > 0
      ? Math.round(body.fileSizeBytes)
      : null;

  const { data: imageRow, error: insertError } = await admin
    .from("gallery_images")
    .insert({
      gallery_id: id,
      storage_path: storagePath,
      filename,
      sort_order: count ?? 0,
      ...(fileSizeBytes !== null ? { file_size_bytes: fileSizeBytes } : {}),
    })
    .select("id, filename, storage_path")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  if (!gallery.hero_image_id && imageRow) {
    await admin.from("galleries").update({ hero_image_id: imageRow.id }).eq("id", id);
  }

  return NextResponse.json({ image: imageRow });
}
