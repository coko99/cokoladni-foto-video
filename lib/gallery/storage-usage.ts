import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/env";
import { BUCKET } from "@/lib/gallery/storage";

const PAGE_SIZE = 1000;

type ListedObject = {
  id: string | null;
  metadata: unknown;
};

function parseMetadataSize(metadata: unknown): number {
  if (!metadata) return 0;

  let meta: unknown = metadata;
  if (typeof metadata === "string") {
    try {
      meta = JSON.parse(metadata);
    } catch {
      return 0;
    }
  }

  if (typeof meta !== "object" || meta === null || !("size" in meta)) {
    return 0;
  }

  const size = Number((meta as { size?: unknown }).size);
  return Number.isFinite(size) && size > 0 ? size : 0;
}

/** SQL funkcija — 100% isto kao Supabase dashboard. */
async function sumFromRpc(): Promise<number | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("gallery_storage_used_bytes");

  if (error) {
    return null;
  }

  const bytes = Number(data);
  return Number.isFinite(bytes) && bytes >= 0 ? bytes : 0;
}

/** Isti izvor kao Supabase dashboard — storage.objects tabela. */
async function sumStorageObjects(): Promise<number | null> {
  const admin = createAdminClient();
  let total = 0;
  let offset = 0;

  while (true) {
    const { data, error } = await admin
      .schema("storage")
      .from("objects")
      .select("metadata")
      .eq("bucket_id", BUCKET)
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      return null;
    }

    if (!data?.length) break;

    for (const row of data) {
      total += parseMetadataSize(row.metadata);
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return total;
}

/** REST rezerva za storage.objects. */
async function sumStorageObjectsRest(): Promise<number | null> {
  const baseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();
  if (!baseUrl || !serviceKey) return null;

  let total = 0;
  let offset = 0;

  while (true) {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/rest/v1/objects`);
    url.searchParams.set("select", "metadata");
    url.searchParams.set("bucket_id", `eq.${BUCKET}`);
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));

    const res = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Accept-Profile": "storage",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const rows = (await res.json()) as { metadata: unknown }[];
    if (!rows.length) break;

    for (const row of rows) {
      total += parseMetadataSize(row.metadata);
    }

    if (rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return total;
}

/** Zbir iz baze — file_size_bytes kolona. */
async function sumFromDatabase(): Promise<{ usedBytes: number; fileCount: number } | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("gallery_images").select("file_size_bytes");

  if (error) {
    if (error.message.includes("file_size_bytes")) {
      return null;
    }
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const usedBytes = rows.reduce((sum, row) => {
    const size = Number(row.file_size_bytes ?? 0);
    return sum + (Number.isFinite(size) && size > 0 ? size : 0);
  }, 0);

  return { usedBytes, fileCount: rows.length };
}

/** Lista fajlova po gallery_id folderima. */
async function sumFromGalleryFolders(): Promise<{ usedBytes: number; fileCount: number }> {
  const admin = createAdminClient();
  const { data: galleries, error: galleriesError } = await admin
    .from("galleries")
    .select("id");

  if (galleriesError) {
    throw new Error(galleriesError.message);
  }

  let usedBytes = 0;
  let fileCount = 0;

  for (const gallery of galleries ?? []) {
    let offset = 0;

    while (true) {
      const { data, error } = await admin.storage.from(BUCKET).list(gallery.id, {
        limit: PAGE_SIZE,
        offset,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.length) break;

      for (const item of data as ListedObject[]) {
        if (item.id === null) continue;
        const size = parseMetadataSize(item.metadata);
        if (size > 0) {
          usedBytes += size;
          fileCount += 1;
        }
      }

      if (data.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
  }

  return { usedBytes, fileCount };
}

async function countGalleryImages(): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("gallery_images")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export async function getGalleryStorageSummary(): Promise<{
  usedBytes: number;
  fileCount: number;
}> {
  const fromRpc = await sumFromRpc();
  if (fromRpc !== null) {
    return { usedBytes: fromRpc, fileCount: await countGalleryImages() };
  }

  const fromObjects = await sumStorageObjects();
  if (fromObjects !== null) {
    return { usedBytes: fromObjects, fileCount: await countGalleryImages() };
  }

  const fromRest = await sumStorageObjectsRest();
  if (fromRest !== null) {
    return { usedBytes: fromRest, fileCount: await countGalleryImages() };
  }

  const fromDb = await sumFromDatabase();
  if (fromDb !== null && fromDb.usedBytes > 0) {
    return fromDb;
  }

  return sumFromGalleryFolders();
}

export async function getGalleryStorageUsageBytes(): Promise<number> {
  const { usedBytes } = await getGalleryStorageSummary();
  return usedBytes;
}

/** Format kao Supabase dashboard (0.001 GB / 1 GB). */
export function formatStorageSize(bytes: number): string {
  const value = Math.max(bytes, 0);

  if (value < 1024) return `${Math.round(value)} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) {
    return `${(value / (1024 * 1024 * 1024)).toFixed(3)} GB`;
  }
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function buildStorageStats(usedBytes: number, quotaGb: number, fileCount = 0) {
  const safeUsed = Math.max(usedBytes, 0);
  const safeQuotaGb = Math.max(quotaGb, 0);
  const quotaBytes = Math.round(safeQuotaGb * 1024 * 1024 * 1024);
  const freeBytes = safeUsed >= quotaBytes ? 0 : quotaBytes - safeUsed;
  const usedPercent = quotaBytes > 0 ? (safeUsed / quotaBytes) * 100 : safeUsed > 0 ? 100 : 0;
  const overQuota = safeUsed > quotaBytes;

  return {
    usedBytes: safeUsed,
    quotaBytes,
    quotaGb: safeQuotaGb,
    freeBytes,
    fileCount,
    usedPercent,
    ringPercent: Math.min(usedPercent, 100),
    displayPercent: Math.max(Math.round(usedPercent), usedPercent > 0 && usedPercent < 1 ? 1 : 0),
    overQuota,
    usedLabel: formatStorageSize(safeUsed),
    quotaLabel: formatStorageSize(quotaBytes),
    freeLabel: formatStorageSize(freeBytes),
  };
}
