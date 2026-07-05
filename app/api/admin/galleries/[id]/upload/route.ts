import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET, ensureGalleryBucket } from "@/lib/gallery/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Nema fajlova za upload." }, { status: 400 });
    }

    await ensureGalleryBucket();
    const admin = createAdminClient();

    const { data: gallery, error: galleryError } = await admin
      .from("galleries")
      .select("id")
      .eq("id", id)
      .single();

    if (galleryError || !gallery) {
      return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
    }

    const { count } = await admin
      .from("gallery_images")
      .select("*", { count: "exact", head: true })
      .eq("gallery_id", id);

    let sortOrder = count ?? 0;
    const uploaded: { id: string; filename: string; storage_path: string }[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${id}/${filename}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await admin.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        errors.push(`${filename}: ${uploadError.message}`);
        continue;
      }

      const { data: imageRow, error: insertError } = await admin
        .from("gallery_images")
        .insert({
          gallery_id: id,
          storage_path: storagePath,
          filename,
          sort_order: sortOrder++,
        })
        .select("id, filename, storage_path")
        .single();

      if (insertError) {
        errors.push(`${filename}: ${insertError.message}`);
        continue;
      }

      if (imageRow) uploaded.push(imageRow);
    }

    if (!uploaded.length) {
      return NextResponse.json(
        {
          error:
            errors[0] ??
            "Upload nije uspeo. Proverite da li postoji bucket gallery-images u Supabase Storage.",
          errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ uploaded, count: uploaded.length, errors });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload nije uspeo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
