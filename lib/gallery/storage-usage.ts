import { createAdminClient } from "@/lib/supabase/admin";
import { getImagePublicUrl } from "@/lib/gallery/utils";

const HEAD_BATCH = 20;

async function sumFromImageHeadRequests(): Promise<{ total: number; fileCount: number }> {
  const admin = createAdminClient();
  const { data: images, error } = await admin
    .from("gallery_images")
    .select("storage_path");

  if (error) {
    throw new Error(error.message);
  }

  const paths = [...new Set((images ?? []).map((row) => row.storage_path).filter(Boolean))];
  if (!paths.length) {
    return { total: 0, fileCount: 0 };
  }

  let total = 0;

  for (let i = 0; i < paths.length; i += HEAD_BATCH) {
    const batch = paths.slice(i, i + HEAD_BATCH);
    const sizes = await Promise.all(
      batch.map(async (path) => {
        try {
          const res = await fetch(getImagePublicUrl(path), {
            method: "HEAD",
            cache: "no-store",
          });
          if (!res.ok) return 0;
          const len = Number(res.headers.get("content-length") ?? 0);
          return Number.isFinite(len) && len > 0 ? len : 0;
        } catch {
          return 0;
        }
      })
    );
    total += sizes.reduce((sum, n) => sum + n, 0);
  }

  return { total, fileCount: paths.length };
}

export async function getGalleryStorageUsageBytes(): Promise<number> {
  const { total } = await sumFromImageHeadRequests();
  return total;
}

export async function getGalleryStorageSummary(): Promise<{ usedBytes: number; fileCount: number }> {
  return sumFromImageHeadRequests();
}

export function formatStorageSize(bytes: number): string {
  const value = Math.max(bytes, 0);

  if (value < 1024) return `${Math.round(value)} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} MB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} GB`;
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
    displayPercent: Math.round(usedPercent),
    overQuota,
    usedLabel: formatStorageSize(safeUsed),
    quotaLabel: formatStorageSize(quotaBytes),
    freeLabel: formatStorageSize(freeBytes),
  };
}
