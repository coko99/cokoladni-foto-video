"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import type { GalleryImage, ImageCounts } from "@/lib/gallery/types";
import { getImageThumbnailUrl } from "@/lib/gallery/utils";
import { getTileSize, tileClasses, type TileSize } from "@/lib/gallery/layout";
import { HeartStack } from "./HeartStack";
import { GalleryLightbox } from "./GalleryLightbox";

type Props = {
  images: GalleryImage[];
  counts: ImageCounts;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

type TileProps = {
  image: GalleryImage;
  index: number;
  count: number;
  onOpen: (index: number) => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

const MasonryTile = memo(function MasonryTile({
  image,
  index,
  count,
  onOpen,
  onAdd,
  onRemove,
}: TileProps) {
  const [tileSize, setTileSize] = useState<TileSize>(getTileSize(index));

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border [content-visibility:auto] [contain-intrinsic-size:200px] ${tileClasses[tileSize]} ${
        count > 0
          ? "border-accent/60 shadow-[0_0_28px_rgba(101,227,255,0.3)]"
          : "border-accent/10 hover:border-accent/35"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="absolute inset-0 z-10 touch-manipulation"
        aria-label={`Pogledaj ${image.filename}`}
      />
      <Image
        src={getImageThumbnailUrl(image.storage_path)}
        alt={image.filename}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover sm:transition-transform sm:duration-300 sm:group-hover:scale-105"
        loading="lazy"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            const next = getTileSize(index, img.naturalWidth / img.naturalHeight);
            setTileSize((prev) => (prev === next ? prev : next));
          }
        }}
      />

      {count > 0 && <div className="absolute inset-0 bg-accent/10 pointer-events-none" />}

      <div className="absolute left-2 top-2 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
        <HeartStack count={count} />
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 touch-manipulation items-center justify-center rounded-full bg-black/70 text-lg font-bold text-white hover:bg-red-500/80"
          aria-label="Smanji broj"
        >
          −
        </button>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAdd(image.id);
        }}
        className={`absolute bottom-2 right-2 z-20 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full ${
          count > 0
            ? "bg-accent text-bg-deep shadow-[0_0_16px_rgba(101,227,255,0.5)]"
            : "bg-black/70 text-white/90 sm:bg-black/55"
        }`}
        aria-label="Dodaj srce"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
});

export function MasonryGalleryGrid({ images, counts, onAdd, onRemove }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpen = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 auto-rows-[88px] gap-1.5 sm:auto-rows-[100px] sm:gap-2 md:grid-cols-4 md:gap-3 lg:auto-rows-[120px]">
        {images.map((img, index) => (
          <MasonryTile
            key={img.id}
            image={img}
            index={index}
            count={counts[img.id] ?? 0}
            onOpen={handleOpen}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          activeIndex={lightboxIndex}
          counts={counts}
          onClose={handleClose}
          onNavigate={setLightboxIndex}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      )}
    </>
  );
}
