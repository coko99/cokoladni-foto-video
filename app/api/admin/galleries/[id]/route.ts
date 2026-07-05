import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateAccessCode } from "@/lib/gallery/utils";
import { hashPin } from "@/lib/gallery/pin";

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
    .order("created_at", { ascending: true });

  const selectionsWithImages = await Promise.all(
    (selections ?? []).map(async (sel) => {
      const { data: links } = await admin
        .from("selection_images")
        .select("image_id")
        .eq("selection_id", sel.id);

      const imageIds = (links ?? []).map((l) => l.image_id);
      const uniqueIds = [...new Set(imageIds)];
      const { data: selImages } = uniqueIds.length
        ? await admin.from("gallery_images").select("*").in("id", uniqueIds)
        : { data: [] };

      const imageMap = new Map((selImages ?? []).map((img) => [img.id, img]));
      const orderedImages = imageIds
        .map((id) => imageMap.get(id))
        .filter((img): img is NonNullable<typeof img> => Boolean(img));

      return {
        ...sel,
        images: orderedImages,
        total_count: orderedImages.length,
      };
    })
  );

  return NextResponse.json({
    gallery,
    images: images ?? [],
    selections: selectionsWithImages,
  });
}

export async function PATCH(
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

  const body = (await request.json()) as {
    accessCode?: string;
    generateAccessCode?: boolean;
    pin?: string | null;
  };

  const admin = createAdminClient();
  const updates: Record<string, string | null> = {};

  if (body.generateAccessCode) {
    updates.access_code = generateAccessCode();
  } else if (body.accessCode !== undefined) {
    const code = body.accessCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,8}$/.test(code)) {
      return NextResponse.json(
        { error: "Kod mora imati 4–8 slova ili brojeva." },
        { status: 400 }
      );
    }
    updates.access_code = code;
  }

  if (body.pin !== undefined) {
    const trimmed = body.pin?.trim() ?? "";
    if (trimmed) {
      updates.pin_hash = await hashPin(trimmed);
      updates.pin_plain = trimmed;
    } else {
      updates.pin_hash = null;
      updates.pin_plain = null;
    }
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nema izmena za čuvanje." }, { status: 400 });
  }

  const { data: gallery, error } = await admin
    .from("galleries")
    .update(updates)
    .eq("id", id)
    .select("access_code, pin_plain, pin_hash")
    .single();

  if (error || !gallery) {
    return NextResponse.json({ error: "Čuvanje nije uspelo." }, { status: 500 });
  }

  return NextResponse.json({
    accessCode: gallery.access_code,
    pinPlain: gallery.pin_plain,
    hasPin: Boolean(gallery.pin_hash),
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
