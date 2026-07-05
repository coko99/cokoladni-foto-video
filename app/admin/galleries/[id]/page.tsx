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
      .order("created_at", { ascending: true });

    const selectionsWithImages: SelectionWithImages[] = await Promise.all(
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
      clientName={data.gallery.client_name}
      slug={data.gallery.slug}
      username={data.gallery.username}
      accessCode={data.gallery.access_code}
      pinPlain={data.gallery.pin_plain}
      heroImageId={data.gallery.hero_image_id}
      publicUrl={galleryPublicUrl(data.gallery.username ?? data.gallery.slug)}
      initialImages={data.images}
      initialSelections={data.selections}
    />
  );
}
