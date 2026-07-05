import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: image, error: imageError } = await admin
    .from("gallery_images")
    .select("id, gallery_id, storage_path")
    .eq("id", imageId)
    .eq("gallery_id", id)
    .single();

  if (imageError || !image) {
    return NextResponse.json({ error: "Slika nije pronađena." }, { status: 404 });
  }

  await admin.storage.from("gallery-images").remove([image.storage_path]);

  const { error: deleteError } = await admin
    .from("gallery_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  await admin
    .from("galleries")
    .update({ hero_image_id: null })
    .eq("id", id)
    .eq("hero_image_id", imageId);

  return NextResponse.json({ success: true });
}
