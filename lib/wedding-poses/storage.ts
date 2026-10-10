import { getSupabaseUrl } from "@/lib/env";

export const WEDDING_POSES_BUCKET = "wedding-poses";

export function getPosePublicUrl(storagePath: string): string {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return storagePath;
  return `${supabaseUrl}/storage/v1/object/public/${WEDDING_POSES_BUCKET}/${storagePath}`;
}

export function getPoseThumbnailUrl(storagePath: string, width = 640): string {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return storagePath;
  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${supabaseUrl}/storage/v1/render/image/public/${WEDDING_POSES_BUCKET}/${encodedPath}?width=${width}&quality=82&resize=contain`;
}
