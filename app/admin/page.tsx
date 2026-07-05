import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { GalleryList } from "@/components/gallery/AdminGallery";
import { StorageUsageCard } from "@/components/gallery/StorageUsageBadge";
import type { GalleryWithStats } from "@/lib/gallery/types";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Admin | Čokoladni Galerija",
  "Upravljanje galerijama i izborima klijenata."
);

async function getGalleries(): Promise<GalleryWithStats[]> {
  try {
    const admin = createAdminClient();
    const { data: galleries } = await admin
      .from("galleries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!galleries) return [];

    return Promise.all(
      galleries.map(async (g) => {
        const [{ count: imageCount }, { count: selectionCount }] = await Promise.all([
          admin
            .from("gallery_images")
            .select("*", { count: "exact", head: true })
            .eq("gallery_id", g.id),
          admin
            .from("selections")
            .select("*", { count: "exact", head: true })
            .eq("gallery_id", g.id),
        ]);
        return {
          ...g,
          image_count: imageCount ?? 0,
          selection_count: selectionCount ?? 0,
        };
      })
    );
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const galleries = await getGalleries();

  return (
    <div>
      <div className="mb-6">
        <StorageUsageCard />
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold sm:text-2xl">Galerije</h1>
          <p className="mt-1 text-sm text-text-muted/60">
            Upravljajte galerijama i pratite izbore klijenata
          </p>
        </div>
        <Link
          href="/admin/galleries/new"
          className="btn-premium w-full rounded-xl px-5 py-2.5 text-center text-sm font-semibold sm:w-auto"
        >
          + Nova galerija
        </Link>
      </div>
      <GalleryList galleries={galleries} />
    </div>
  );
}
