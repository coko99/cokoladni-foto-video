"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";

type Props = {
  open: boolean;
  current: number;
  total: number;
  filename?: string;
};

export function UploadOverlay({ open, current, total, filename }: Props) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#05070D]/92 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label="Upload slika u toku"
    >
      <div
        className="pointer-events-auto flex flex-col items-center px-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="upload-logo-stage relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          <div className="upload-neon-ring upload-neon-ring-outer absolute inset-0 rounded-full" />
          <div className="upload-neon-ring upload-neon-ring-inner absolute inset-3 rounded-full" />
          <div className="upload-neon-ring upload-neon-ring-dots absolute inset-6 rounded-full" />
          <div className="relative z-10">
            <Logo size="hero" priority className="!h-28 !w-28 sm:!h-36 sm:!w-36" />
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-accent/90">
          Upload u toku
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-gradient-accent">
          {current} / {total}
        </p>
        {filename && (
          <p className="mt-2 max-w-xs truncate text-sm text-text-muted/70">{filename}</p>
        )}

        <div className="mt-8 w-full max-w-xs">
          <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.25em] text-accent/50">
            <span>Slika</span>
            <span>{percent}%</span>
          </div>
          <div className="preloader-track h-[3px] overflow-hidden rounded-full bg-white/8">
            <div
              className="preloader-bar h-full rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent/80 transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-text-muted/45">
          Sačekajte — ne zatvarajte stranicu dok se slike ne ubace
        </p>
      </div>
    </div>
  );
}
