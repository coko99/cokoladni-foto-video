import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  formatStorageSize,
  getGalleryStorageUsageBytes,
} from "@/lib/gallery/storage-usage";
import { getStorageQuotaBytes } from "@/lib/env";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  try {
    const usedBytes = await getGalleryStorageUsageBytes();
    const quotaBytes = getStorageQuotaBytes();
    const freeBytes = Math.max(quotaBytes - usedBytes, 0);
    const usedPercent = quotaBytes > 0 ? Math.min((usedBytes / quotaBytes) * 100, 100) : 0;

    return NextResponse.json({
      usedBytes,
      quotaBytes,
      freeBytes,
      usedPercent,
      usedLabel: formatStorageSize(usedBytes),
      quotaLabel: formatStorageSize(quotaBytes),
      freeLabel: formatStorageSize(freeBytes),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Provera prostora nije uspela.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
