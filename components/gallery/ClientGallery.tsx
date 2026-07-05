"use client";

import { useState } from "react";
import Image from "next/image";
import type { Gallery, GalleryImage } from "@/lib/gallery/types";
import { getImagePublicUrl } from "@/lib/gallery/utils";

type Props = {
  gallery: Gallery;
  images: GalleryImage[];
  needsPin: boolean;
};

export function ClientGallery({ gallery, images, needsPin }: Props) {
  const [pinVerified, setPinVerified] = useState(!needsPin);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    clientName: gallery.client_name,
    clientEmail: gallery.client_email,
    clientPhone: "",
    note: "",
  });

  async function verifyPin(e: React.FormEvent) {
    e.preventDefault();
    setPinError("");

    const res = await fetch(`/api/galleries/${gallery.slug}/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (!res.ok) {
      const data = await res.json();
      setPinError(data.error ?? "Pogrešna šifra.");
      return;
    }

    setPinVerified(true);
  }

  function toggleImage(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (gallery.max_selections && next.size >= gallery.max_selections) {
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch(`/api/galleries/${gallery.slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone || undefined,
        note: form.note || undefined,
        imageIds: Array.from(selected),
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
      setShowForm(false);
    } else {
      const data = await res.json();
      alert(data.error ?? "Slanje nije uspelo.");
    }
  }

  if (!pinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={verifyPin} className="glass-strong w-full max-w-sm rounded-2xl p-6 space-y-4">
          <h2 className="text-center font-display text-xl font-semibold text-gradient-accent">
            {gallery.title}
          </h2>
          <p className="text-center text-sm text-text-muted/60">
            Ova galerija je zaštićena šifrom
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
            placeholder="Unesite šifru"
            autoFocus
          />
          {pinError && <p className="text-sm text-red-400 text-center">{pinError}</p>}
          <button type="submit" className="btn-premium w-full rounded-xl py-3 text-sm font-semibold">
            Otvori galeriju
          </button>
        </form>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-strong max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-2xl">
            ✓
          </div>
          <h2 className="font-display text-xl font-semibold text-gradient-accent">
            Izbor je poslat!
          </h2>
          <p className="mt-2 text-sm text-text-muted/70">
            Hvala! Fotograf će dobiti email sa vašim izborom od {selected.size} slika.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 border-b border-accent/15 bg-bg-deep/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="font-display text-xl font-semibold sm:text-2xl">{gallery.title}</h1>
          <p className="mt-1 text-sm text-text-muted/60">
            Kliknite srce da izaberete omiljene fotografije
            {gallery.max_selections && ` (max ${gallery.max_selections})`}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-3">
          {images.map((img) => {
            const isSelected = selected.has(img.id);
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => toggleImage(img.id)}
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "border-accent shadow-[0_0_24px_rgba(101,227,255,0.35)]"
                    : "border-accent/10 hover:border-accent/30"
                }`}
              >
                <Image
                  src={getImagePublicUrl(img.storage_path)}
                  alt={img.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-accent text-bg-deep scale-100"
                      : "bg-black/40 text-white/80 scale-90 opacity-0 group-hover:opacity-100 sm:opacity-100"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill={isSelected ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {images.length === 0 && (
          <p className="py-20 text-center text-text-muted/50">
            Galerija još nema slika.
          </p>
        )}
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-accent/25 bg-bg-deep/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm font-medium text-accent">
              {selected.size} {selected.size === 1 ? "slika" : "slika"} izabrano
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-premium rounded-xl px-6 py-2.5 text-sm font-semibold animate-neon-pulse"
            >
              Pošalji izbor
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="glass-strong w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display text-lg font-semibold">Pošaljite izbor</h3>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-accent/70">Ime</label>
              <input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                required
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-accent/70">Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                required
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-accent/70">Telefon</label>
              <input
                value={form.clientPhone}
                onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-accent/70">Napomena</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm outline-none focus:border-accent/60 resize-none"
                placeholder="Dodatne napomene..."
              />
            </div>
            <p className="text-xs text-text-muted/50">
              Šaljete {selected.size} izabranih fotografija
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost flex-1 rounded-xl py-2.5 text-sm"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-premium flex-1 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? "Slanje..." : "Pošalji"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
