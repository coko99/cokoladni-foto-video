"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage, ImageCounts } from "@/lib/gallery/types";
import { getImagePublicUrl, preloadImageUrl } from "@/lib/gallery/utils";
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
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const imageUrl = image ? getImagePublicUrl(image.storage_path) : "";

  const goPrev = useCallback(() => {
    if (activeIndex > 0) onNavigate(activeIndex - 1);
  }, [activeIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex < images.length - 1) onNavigate(activeIndex + 1);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    setLoaded(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!image) return;
    if (hasPrev) preloadImageUrl(getImagePublicUrl(images[activeIndex - 1].storage_path));
    if (hasNext) preloadImageUrl(getImagePublicUrl(images[activeIndex + 1].storage_path));
  }, [activeIndex, hasNext, hasPrev, image, images]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, onClose]);

  if (!image || !mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#050508]/98"
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
          className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
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
            className="absolute left-1 z-20 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black/85 sm:left-3"
            aria-label="Prethodna slika"
          >
            ‹
          </button>
        )}

        <div
          className={`relative flex h-[min(72vh,calc(100svh-8rem))] w-full max-w-5xl items-center justify-center overflow-hidden rounded-2xl border ${
            count > 0
              ? "border-accent/60 shadow-[0_0_32px_rgba(101,227,255,0.3)]"
              : "border-white/10"
          }`}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={image.filename}
            decoding="async"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
            className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {count > 0 && <div className="pointer-events-none absolute inset-0 bg-accent/10" />}

          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1.5">
            <HeartStack count={count} />
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-black/70 text-xl font-bold text-white hover:bg-red-500/80"
              aria-label="Smanji broj"
            >
              −
            </button>
          )}

          <button
            type="button"
            onClick={() => onAdd(image.id)}
            className={`absolute bottom-3 right-3 z-20 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full ${
              count > 0
                ? "bg-accent text-bg-deep shadow-[0_0_20px_rgba(101,227,255,0.55)]"
                : "bg-black/70 text-white/90 hover:bg-black/85"
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
            className="absolute right-1 z-20 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black/85 sm:right-3"
            aria-label="Sledeća slika"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
