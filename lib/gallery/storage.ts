import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "gallery-images";

export async function ensureGalleryBucket() {
  const admin = createAdminClient();

  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) {
    throw new Error(`Ne mogu da proverim storage: ${listError.message}`);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return;

  const { error: createError } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 20 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"],
  });

  if (createError) {
    throw new Error(`Bucket "${BUCKET}" ne postoji. Kreiraj ga u Supabase Storage.`);
  }
}

export { BUCKET };
