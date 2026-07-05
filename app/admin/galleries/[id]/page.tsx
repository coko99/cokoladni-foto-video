import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { GalleryAdminDetail } from "@/components/gallery/GalleryAdminDetail";
import { galleryPublicUrl } from "@/lib/gallery/utils";
import type { SelectionWithImages } from "@/lib/gallery/types";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Galerija | Admin", "Detalji galerije i izbori.");

async function getGalleryData(id: string) {
  try {
    const admin = createAdminClient();

    const { data: gallery, error } = await admin
      .from("galleries")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !gallery) return null;

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

    const selectionsWithImages: SelectionWithImages[] = await Promise.all(
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

    return { gallery, images: images ?? [], selections: selectionsWithImages };
  } catch {
    return null;
  }
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getGalleryData(id);

  if (!data) notFound();

  return (
    <GalleryAdminDetail
      galleryId={data.gallery.id}
      galleryTitle={data.gallery.title}
      slug={data.gallery.slug}
      publicUrl={galleryPublicUrl(data.gallery.slug)}
      initialImages={data.images}
      initialSelections={data.selections}
    />
  );
}
