"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery/types";
import { getImagePublicUrl } from "@/lib/gallery/utils";

type Props = {
  galleryId: string;
  images: GalleryImage[];
  onReorder: (images: GalleryImage[]) => void;
  onDelete: (imageId: string) => void;
  deletingId: string | null;
};

export function AdminImageSorter({
  galleryId,
  images,
  onReorder,
  onDelete,
  deletingId,
}: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function persistOrder(nextImages: GalleryImage[]) {
    setSaving(true);
    const res = await fetch(`/api/admin/galleries/${galleryId}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: nextImages.map((img) => img.id) }),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Čuvanje redosleda nije uspelo.");
    }
  }

  function reorder(draggedId: string, targetId: string) {
    if (draggedId === targetId) return;
    const from = images.findIndex((img) => img.id === draggedId);
    const to = images.findIndex((img) => img.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const withOrder = next.map((img, i) => ({ ...img, sort_order: i }));
    onReorder(withOrder);
    persistOrder(withOrder);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-muted/50">
          Prevucite slike da promenite redosled · prva = hero naslovna
        </p>
        {saving && <p className="text-xs text-accent animate-pulse">Čuvanje...</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => setDragId(img.id)}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverId(img.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) reorder(dragId, img.id);
              setDragId(null);
              setOverId(null);
            }}
            className={`group relative aspect-square cursor-grab overflow-hidden rounded-xl border transition-all active:cursor-grabbing ${
              dragId === img.id ? "opacity-40 scale-95" : ""
            } ${
              overId === img.id && dragId !== img.id
                ? "border-accent shadow-[0_0_24px_rgba(101,227,255,0.4)]"
                : "border-accent/15"
            }`}
          >
            <Image
              src={getImagePublicUrl(img.storage_path)}
              alt={img.filename}
              fill
              sizes="180px"
              className="object-cover pointer-events-none"
              loading="lazy"
            />
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-accent">
              {index === 0 ? "HERO" : index + 1}
            </span>
            <button
              type="button"
              onClick={() => onDelete(img.id)}
              disabled={deletingId === img.id}
              className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-sm font-bold text-white"
              aria-label="Obriši"
            >
              ×
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] truncate text-white/80">
              {img.filename}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
