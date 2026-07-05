import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/gallery/storage";
import { sanitizeFilename } from "@/lib/gallery/filename";

type SignedUrlPayload = {
  filename: string;
  contentType?: string;
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

  let body: SignedUrlPayload;
  try {
    body = (await request.json()) as SignedUrlPayload;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const filename = sanitizeFilename(body.filename?.trim() ?? "");
  if (!filename) {
    return NextResponse.json({ error: "Nedostaje ime fajla." }, { status: 400 });
  }

  const storagePath = `${id}/${filename}`;
  const admin = createAdminClient();

  const { data: gallery, error: galleryError } = await admin
    .from("galleries")
    .select("id")
    .eq("id", id)
    .single();

  if (galleryError || !gallery) {
    return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
  }

  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: true });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Signed URL nije kreiran." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    filename,
    storagePath: data.path,
    signedUrl: data.signedUrl,
    token: data.token,
    contentType: body.contentType || "image/jpeg",
  });
}
