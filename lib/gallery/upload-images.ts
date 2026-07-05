import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/gallery/storage";
import { sanitizeFilename } from "@/lib/gallery/filename";

export type UploadedImageRow = {
  id: string;
  filename: string;
  storage_path: string;
  file_size_bytes: number | null;
};

type UploadResult = {
  uploaded: UploadedImageRow[];
  errors: string[];
};

async function parseErrorResponse(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const data = JSON.parse(text) as { error?: string };
    return data.error ?? text;
  } catch {
    if (res.status === 413) {
      return "Fajl je prevelik za server.";
    }
    return text || `Greška ${res.status}`;
  }
}

export async function uploadGalleryImages(
  galleryId: string,
  files: File[],
  onProgress?: (current: number, total: number, filename: string) => void
): Promise<UploadResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { uploaded: [], errors: ["Niste prijavljeni."] };
  }

  const uploaded: UploadedImageRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = sanitizeFilename(file.name);

    onProgress?.(i + 1, files.length, filename);

    const signRes = await fetch(`/api/admin/galleries/${galleryId}/images/signed-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "image/jpeg",
      }),
    });

    if (!signRes.ok) {
      errors.push(`${filename}: ${await parseErrorResponse(signRes)}`);
      continue;
    }

    const signData = (await signRes.json()) as {
      storagePath: string;
      filename: string;
      signedUrl: string;
      token: string;
    };

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .uploadToSignedUrl(signData.storagePath, signData.token, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      errors.push(`${filename}: ${uploadError.message}`);
      continue;
    }

    const res = await fetch(`/api/admin/galleries/${galleryId}/images/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        filename: signData.filename,
        storagePath: signData.storagePath,
        fileSizeBytes: file.size,
      }),
    });

    if (!res.ok) {
      errors.push(`${filename}: ${await parseErrorResponse(res)}`);
      continue;
    }

    const data = (await res.json()) as { image: UploadedImageRow };
    if (data.image) uploaded.push(data.image);
  }

  return { uploaded, errors };
}
