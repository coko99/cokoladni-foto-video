import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { findGalleryByIdentifier } from "@/lib/gallery/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientGallery } from "@/components/gallery/ClientGallery";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Album | Čokoladni",
  "Privatni album fotografija — izaberite omiljene slike."
);

async function getGallery(identifier: string) {
  try {
    const gallery = await findGalleryByIdentifier(identifier);
    if (!gallery) return null;

    const admin = createAdminClient();
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

  const key = data.gallery.username ?? data.gallery.slug;
  const cookieStore = await cookies();
  const verified = cookieStore.get(`gallery_verified_${key}`);
  const needsAccess = !verified;

  return (
    <ClientGallery
      gallery={data.gallery}
      images={data.images}
      needsAccess={needsAccess}
    />
  );
}
