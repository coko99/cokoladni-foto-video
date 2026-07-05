import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
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

  const admin = createAdminClient();

  const { data: gallery, error } = await admin
    .from("galleries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !gallery) {
    return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
  }

  const { data: images } = await admin
    .from("gallery_images")
    .select("*")
    .eq("gallery_id", id)
    .order("sort_order", { ascending: true });

  const { data: selections } = await admin
    .from("selections")
    .select("*")
    .eq("gallery_id", id)
    .order("created_at", { ascending: false });

  const selectionsWithImages = await Promise.all(
    (selections ?? []).map(async (sel) => {
      const { data: links } = await admin
        .from("selection_images")
        .select("image_id")
        .eq("selection_id", sel.id);

      const imageIds = (links ?? []).map((l) => l.image_id);
      const { data: selImages } = imageIds.length
        ? await admin.from("gallery_images").select("*").in("id", imageIds)
        : { data: [] };

      return { ...sel, images: selImages ?? [] };
    })
  );

  return NextResponse.json({
    gallery,
    images: images ?? [],
    selections: selectionsWithImages,
  });
}

export async function DELETE(
  _request: Request,
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

  const admin = createAdminClient();

  const { data: images } = await admin
    .from("gallery_images")
    .select("storage_path")
    .eq("gallery_id", id);

  if (images?.length) {
    await admin.storage
      .from("gallery-images")
      .remove(images.map((i) => i.storage_path));
  }

  const { error } = await admin.from("galleries").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
