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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:pb-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent/80">
          Čokoladni Foto & Video
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          <span className="text-gradient-accent">{title}</span>
        </h1>

        {(eventType || hostsInfo || formattedDate) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {eventType && (
              <span className="glass rounded-full px-4 py-2 text-sm font-medium text-accent neon-border">
                {eventType}
              </span>
            )}
            {hostsInfo && (
              <span className="glass rounded-full px-4 py-2 text-sm text-text-primary neon-border">
                {hostsInfo}
              </span>
            )}
            {formattedDate && (
              <span className="glass rounded-full px-4 py-2 text-sm text-accent">
                {formattedDate}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={scrollToGallery}
          className="btn-premium mt-10 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide animate-neon-pulse"
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
