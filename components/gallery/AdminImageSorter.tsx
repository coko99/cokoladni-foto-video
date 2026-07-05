"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery/types";
import { getImagePublicUrl } from "@/lib/gallery/utils";

type Props = {
  galleryId: string;
  images: GalleryImage[];
  heroImageId: string | null;
  selectedIds: Set<string>;
  onToggleSelect: (imageId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onReorder: (images: GalleryImage[]) => void;
  onSetHero: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  deletingId: string | null;
};

export function AdminImageSorter({
  galleryId,
  images,
  heroImageId,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onReorder,
  onSetHero,
  onDelete,
  deletingId,
}: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [settingHeroId, setSettingHeroId] = useState<string | null>(null);

  const activeHeroId = heroImageId ?? images[0]?.id ?? null;
  const allSelected = images.length > 0 && selectedIds.size === images.length;

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

  async function setHero(imageId: string) {
    setSettingHeroId(imageId);
    const res = await fetch(`/api/admin/galleries/${galleryId}/hero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    setSettingHeroId(null);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Postavljanje hero slike nije uspelo.");
      return;
    }
    onSetHero(imageId);
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
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-xs text-text-muted/50">
          Izaberite slike za brisanje · klikni „Hero” · prevuci za redosled
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={allSelected ? onClearSelection : onSelectAll}
            className="rounded-lg border border-accent/20 px-2.5 py-1 text-[11px] text-accent/80 transition hover:border-accent/40 hover:bg-accent/10"
          >
            {allSelected ? "Poništi izbor" : "Izaberi sve"}
          </button>
          {(saving || settingHeroId) && (
            <p className="text-xs text-accent animate-pulse">Čuvanje...</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, index) => {
          const isHero = img.id === activeHeroId;
          const isSelected = selectedIds.has(img.id);
          return (
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
                isSelected
                  ? "border-red-400/70 shadow-[0_0_20px_rgba(248,113,113,0.25)]"
                  : isHero
                    ? "border-accent shadow-[0_0_24px_rgba(101,227,255,0.45)]"
                    : overId === img.id && dragId !== img.id
                      ? "border-accent/60 shadow-[0_0_16px_rgba(101,227,255,0.25)]"
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

              <label className="absolute left-2 top-2 z-20 flex cursor-pointer items-center gap-1 rounded-full bg-black/65 px-1.5 py-1 backdrop-blur-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(img.id)}
                  className="h-3.5 w-3.5 rounded border-accent/40 accent-accent"
                />
                <span className="pr-0.5 text-[10px] font-bold text-white/80">{index + 1}</span>
              </label>

              {isHero ? (
                <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-bg-deep">
                  HERO
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setHero(img.id)}
                  disabled={settingHeroId === img.id}
                  className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-accent transition hover:bg-accent hover:text-bg-deep disabled:opacity-50"
                >
                  Hero
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(img.id)}
                disabled={deletingId === img.id}
                className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-[0_0_12px_rgba(248,113,113,0.45)] transition hover:bg-red-400 disabled:opacity-50"
                aria-label="Obriši sliku"
              >
                {deletingId === img.id ? "..." : "Obriši"}
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] truncate text-white/80">
                {img.filename}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
