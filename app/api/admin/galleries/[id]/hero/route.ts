import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const { imageId } = (await request.json()) as { imageId?: string };
  if (!imageId) {
    return NextResponse.json({ error: "Izaberite sliku." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: image, error: imageError } = await admin
    .from("gallery_images")
    .select("id")
    .eq("id", imageId)
    .eq("gallery_id", id)
    .single();

  if (imageError || !image) {
    return NextResponse.json({ error: "Slika nije u ovom albumu." }, { status: 404 });
  }

  const { error } = await admin
    .from("galleries")
    .update({ hero_image_id: imageId })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Čuvanje hero slike nije uspelo." }, { status: 500 });
  }

  return NextResponse.json({ success: true, heroImageId: imageId });
}
