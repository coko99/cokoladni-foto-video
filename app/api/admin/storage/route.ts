import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildStorageStats,
  getGalleryStorageSummary,
} from "@/lib/gallery/storage-usage";
import { getStorageQuotaGb } from "@/lib/env";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  try {
    const { usedBytes, fileCount } = await getGalleryStorageSummary();
    const quotaGb = getStorageQuotaGb();

    return NextResponse.json(buildStorageStats(usedBytes, quotaGb, fileCount));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Provera prostora nije uspela.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
