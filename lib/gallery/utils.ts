import { getSiteUrl, getSupabaseUrl } from "@/lib/env";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function generateSlug(title: string): string {
  const base = slugify(title);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : suffix;
}

export function galleryPublicUrl(slug: string): string {
  return `${getSiteUrl()}/g/${slug}`;
}

export function getImagePublicUrl(storagePath: string): string {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return storagePath;
  return `${supabaseUrl}/storage/v1/object/public/gallery-images/${storagePath}`;
}
