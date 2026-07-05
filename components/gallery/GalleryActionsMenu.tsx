"use client";

import { useState } from "react";

type Props = {
  onDelete: () => void;
  className?: string;
  menuAbove?: boolean;
};

export function GalleryActionsMenu({ onDelete, className, menuAbove = false }: Props) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    setOpen(false);
    onDelete();
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted/70 transition hover:bg-accent/10 hover:text-accent"
        aria-label="Opcije galerije"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Zatvori meni"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute right-0 z-30 min-w-[9rem] overflow-hidden rounded-xl border border-accent/20 bg-bg-deep py-1 shadow-xl ${
              menuAbove ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Obriši
            </button>
          </div>
        </>
      )}
    </div>
  );
}
