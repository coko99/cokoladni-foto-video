"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { GalleryImage, SelectionWithImages } from "@/lib/gallery/types";
import { getImagePublicUrl } from "@/lib/gallery/utils";
import { CopyButton } from "./AdminNav";

type Props = {
  galleryId: string;
  galleryTitle: string;
  slug: string;
  publicUrl: string;
  initialImages: GalleryImage[];
  initialSelections: SelectionWithImages[];
};

export function GalleryAdminDetail({
  galleryId,
  galleryTitle,
  slug,
  publicUrl,
  initialImages,
  initialSelections,
}: Props) {
  const [images, setImages] = useState(initialImages);
  const [selections] = useState(initialSelections);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress(`Upload 0/${files.length}...`);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    const res = await fetch(`/api/admin/galleries/${galleryId}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);
    setUploadProgress("");

    if (!res.ok) {
      setUploadError(data.error ?? "Upload nije uspeo.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (data.uploaded?.length) {
      setImages((prev) => [
        ...prev,
        ...data.uploaded.map(
          (u: { id: string; filename: string; storage_path: string }, i: number) => ({
            id: u.id,
            gallery_id: galleryId,
            storage_path: u.storage_path,
            filename: u.filename,
            sort_order: prev.length + i,
            created_at: new Date().toISOString(),
          })
        ),
      ]);
      setUploadProgress(`Uspešno uploadovano: ${data.uploaded.length} slika`);
      setTimeout(() => setUploadProgress(""), 3000);
    } else {
      setUploadError("Nijedna slika nije uploadovana.");
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{galleryTitle}</h1>
          <p className="mt-1 text-sm text-text-muted/60">/{slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={publicUrl} />
        </div>
      </div>

      <section className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
          Upload slika
        </h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="block w-full text-sm text-text-muted/70 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/25"
        />
        {uploading && (
          <p className="mt-2 text-sm text-accent animate-pulse">{uploadProgress}</p>
        )}
        {uploadProgress && !uploading && (
          <p className="mt-2 text-sm text-accent">{uploadProgress}</p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-400">{uploadError}</p>
        )}
        <p className="mt-2 text-xs text-text-muted/40">
          {images.length} slika u galeriji
        </p>
      </section>

      {images.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            Slike
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-accent/15">
                <Image
                  src={getImagePublicUrl(img.storage_path)}
                  alt={img.filename}
                  fill
                  sizes="150px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
          Izbori klijenata ({selections.length})
        </h2>
        {selections.length === 0 ? (
          <p className="text-sm text-text-muted/50">Još nema poslatih izbora.</p>
        ) : (
          <div className="space-y-4">
            {selections.map((sel) => (
              <div
                key={sel.id}
                className="rounded-xl border border-accent/15 bg-bg-deep/40 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{sel.client_name}</p>
                    <p className="text-xs text-text-muted/60">
                      {sel.client_email}
                      {sel.client_phone && ` · ${sel.client_phone}`}
                    </p>
                  </div>
                  <p className="text-xs text-accent/70">
                    {new Date(sel.created_at).toLocaleDateString("sr-RS")} ·{" "}
                    {sel.images.length} slika
                  </p>
                </div>
                {sel.note && (
                  <p className="mt-2 text-sm text-text-muted/70">"{sel.note}"</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sel.images.map((img) => (
                    <span
                      key={img.id}
                      className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent/80"
                    >
                      {img.filename}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
