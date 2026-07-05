import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/gallery/storage";

const LIST_LIMIT = 1000;

async function sumFolderUsage(prefix: string): Promise<number> {
  const admin = createAdminClient();
  let total = 0;
  let offset = 0;

  while (true) {
    const { data, error } = await admin.storage.from(BUCKET).list(prefix, {
      limit: LIST_LIMIT,
      offset,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.length) break;

    for (const item of data) {
      const size = item.metadata?.size;
      if (typeof size === "number") {
        total += size;
        continue;
      }

      const nextPrefix = prefix ? `${prefix}/${item.name}` : item.name;
      total += await sumFolderUsage(nextPrefix);
    }

    if (data.length < LIST_LIMIT) break;
    offset += LIST_LIMIT;
  }

  return total;
}

export async function getGalleryStorageUsageBytes(): Promise<number> {
  return sumFolderUsage("");
}

export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} MB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} GB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
