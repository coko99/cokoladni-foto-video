import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type BulkDeletePayload = {
  imageIds?: string[];
  deleteAll?: boolean;
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

  let body: BulkDeletePayload;
  try {
    body = (await request.json()) as BulkDeletePayload;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const admin = createAdminClient();

  let imageIds = body.imageIds ?? [];
  if (body.deleteAll) {
    const { data: allImages, error: listError } = await admin
      .from("gallery_images")
      .select("id")
      .eq("gallery_id", id);

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    imageIds = (allImages ?? []).map((img) => img.id);
  }

  if (!imageIds.length) {
    return NextResponse.json({ error: "Nema slika za brisanje." }, { status: 400 });
  }

  const uniqueIds = [...new Set(imageIds)];

  const { data: images, error: imagesError } = await admin
    .from("gallery_images")
    .select("id, storage_path")
    .eq("gallery_id", id)
    .in("id", uniqueIds);

  if (imagesError) {
    return NextResponse.json({ error: imagesError.message }, { status: 500 });
  }

  if (!images?.length) {
    return NextResponse.json({ error: "Slike nisu pronađene." }, { status: 404 });
  }

  const storagePaths = images.map((img) => img.storage_path).filter(Boolean);
  if (storagePaths.length) {
    await admin.storage.from("gallery-images").remove(storagePaths);
  }

  const deletedIds = images.map((img) => img.id);
  const { error: deleteError } = await admin
    .from("gallery_images")
    .delete()
    .in("id", deletedIds);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  await admin
    .from("galleries")
    .update({ hero_image_id: null })
    .eq("id", id)
    .in("hero_image_id", deletedIds);

  return NextResponse.json({
    deletedCount: deletedIds.length,
    deletedIds,
  });
}
