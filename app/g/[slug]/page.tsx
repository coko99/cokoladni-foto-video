import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientGallery } from "@/components/gallery/ClientGallery";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Galerija | Čokoladni",
  "Privatna galerija fotografija — izaberite omiljene slike."
);

async function getGallery(slug: string) {
  try {
    const admin = createAdminClient();

    const { data: gallery, error } = await admin
      .from("galleries")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !gallery) return null;

    const { data: images } = await admin
      .from("gallery_images")
      .select("*")
      .eq("gallery_id", gallery.id)
      .order("sort_order", { ascending: true });

    return { gallery, images: images ?? [] };
  } catch {
    return null;
  }
}

export default async function PublicGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getGallery(slug);

  if (!data) notFound();

  const cookieStore = await cookies();
  const pinCookie = cookieStore.get(`gallery_pin_${slug}`);
  const needsPin = Boolean(data.gallery.pin_hash) && !pinCookie;

  return (
    <ClientGallery
      gallery={data.gallery}
      images={data.images}
      needsPin={needsPin}
    />
  );
}
