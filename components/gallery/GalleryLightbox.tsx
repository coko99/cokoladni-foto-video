"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { GalleryImage, ImageCounts } from "@/lib/gallery/types";
import { getImagePublicUrl } from "@/lib/gallery/utils";
import { HeartStack } from "./HeartStack";

type Props = {
  images: GalleryImage[];
  activeIndex: number;
  counts: ImageCounts;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export function GalleryLightbox({
  images,
  activeIndex,
  counts,
  onClose,
  onNavigate,
  onAdd,
  onRemove,
}: Props) {
  const image = images[activeIndex];
  const count = image ? (counts[image.id] ?? 0) : 0;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(activeIndex - 1);
  }, [activeIndex, hasPrev, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(activeIndex + 1);
  }, [activeIndex, hasNext, onNavigate]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Pregled: ${image.filename}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/90">{image.filename}</p>
          <p className="text-xs text-white/45">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
          aria-label="Zatvori"
        >
          ×
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-3 sm:px-4">
        {hasPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-1 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-2xl text-white backdrop-blur-sm transition hover:bg-black/75 sm:left-3"
            aria-label="Prethodna slika"
          >
            ‹
          </button>
        )}

        <div
          className={`relative h-full w-full max-h-[calc(100vh-10rem)] max-w-5xl overflow-hidden rounded-2xl border transition-all duration-300 ${
            count > 0
              ? "border-accent/60 shadow-[0_0_40px_rgba(101,227,255,0.35)]"
              : "border-white/10"
          }`}
        >
          <Image
            src={getImagePublicUrl(image.storage_path)}
            alt={image.filename}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />

          {count > 0 && <div className="pointer-events-none absolute inset-0 bg-accent/10" />}

          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur-sm">
            <HeartStack count={count} />
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-red-500/80"
              aria-label="Smanji broj"
            >
              −
            </button>
          )}

          <button
            type="button"
            onClick={() => onAdd(image.id)}
            className={`absolute bottom-3 right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              count > 0
                ? "bg-accent text-bg-deep shadow-[0_0_20px_rgba(101,227,255,0.55)]"
                : "bg-black/55 text-white/90 hover:bg-black/75"
            }`}
            aria-label="Dodaj srce"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {hasNext && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-1 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-2xl text-white backdrop-blur-sm transition hover:bg-black/75 sm:right-3"
            aria-label="Sledeća slika"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
