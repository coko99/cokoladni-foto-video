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

  const { imageIds } = (await request.json()) as { imageIds: string[] };
  if (!imageIds?.length) {
    return NextResponse.json({ error: "Prazan redosled." }, { status: 400 });
  }

  const admin = createAdminClient();

  await Promise.all(
    imageIds.map((imageId, sortOrder) =>
      admin
        .from("gallery_images")
        .update({ sort_order: sortOrder })
        .eq("id", imageId)
        .eq("gallery_id", id)
    )
  );

  return NextResponse.json({ success: true });
}
