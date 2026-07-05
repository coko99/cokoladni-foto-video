"use client";

import Image from "next/image";
import { getImagePublicUrl } from "@/lib/gallery/utils";
import type { GalleryImage } from "@/lib/gallery/types";

type Props = {
  title: string;
  hostsInfo: string | null;
  eventType: string | null;
  eventDate: string | null;
  coverImage: GalleryImage | null;
};

function formatEventDate(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("sr-RS", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AlbumHero({ title, hostsInfo, eventType, eventDate, coverImage }: Props) {
  const formattedDate = formatEventDate(eventDate);

  function scrollToGallery() {
    document.getElementById("album-gallery")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {coverImage ? (
        <Image
          src={getImagePublicUrl(coverImage.storage_path)}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 brand-bg" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/70 to-bg-deep/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(101,227,255,0.12),transparent_65%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/80 sm:text-xs sm:tracking-[0.35em]">
          Čokoladni Foto & Video
        </p>
        <h1 className="font-display text-2xl font-semibold leading-tight text-white break-words sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-gradient-accent">{title}</span>
        </h1>

        {(eventType || hostsInfo || formattedDate) && (
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {eventType && (
              <span className="glass rounded-full px-3 py-1.5 text-xs font-medium text-accent neon-border sm:px-4 sm:py-2 sm:text-sm">
                {eventType}
              </span>
            )}
            {hostsInfo && (
              <span className="glass max-w-full rounded-full px-3 py-1.5 text-xs text-text-primary neon-border break-words sm:px-4 sm:py-2 sm:text-sm">
                {hostsInfo}
              </span>
            )}
            {formattedDate && (
              <span className="glass rounded-full px-3 py-1.5 text-xs text-accent sm:px-4 sm:py-2 sm:text-sm">
                {formattedDate}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={scrollToGallery}
          className="btn-premium mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide animate-neon-pulse sm:mt-10 sm:inline-flex sm:w-auto sm:px-8 sm:py-3.5"
        >
          Pogledaj galeriju
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
