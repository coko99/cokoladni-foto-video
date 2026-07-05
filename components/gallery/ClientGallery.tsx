"use client";

import { useState, useMemo } from "react";
import type { Gallery, GalleryImage, ImageCounts } from "@/lib/gallery/types";
import { MasonryGalleryGrid } from "./MasonryGalleryGrid";
import { AlbumHero } from "./AlbumHero";
import { groupImagesByFilename } from "@/lib/gallery/email";
import { getGalleryCoverImage } from "@/lib/gallery/cover";
import { SENDER_RELATIONS } from "@/lib/gallery/relations";

type Props = {
  gallery: Gallery;
  images: GalleryImage[];
  needsAccess: boolean;
};

function totalCount(counts: ImageCounts) {
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

function expandImageIds(counts: ImageCounts): string[] {
  return Object.entries(counts).flatMap(([id, qty]) => Array(qty).fill(id));
}

export function ClientGallery({ gallery, images, needsAccess }: Props) {
  const galleryKey = gallery.username ?? gallery.slug;
  const [accessVerified, setAccessVerified] = useState(!needsAccess);
  const [activeSender, setActiveSender] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [pin, setPin] = useState("");
  const [accessError, setAccessError] = useState("");
  const [counts, setCounts] = useState<ImageCounts>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [note, setNote] = useState("");

  const total = useMemo(() => totalCount(counts), [counts]);
  const coverImage = getGalleryCoverImage(gallery, images);
  const summary = useMemo(() => {
    const expanded = expandImageIds(counts);
    const byId = new Map(images.map((img) => [img.id, img]));
    return groupImagesByFilename(
      expanded.map((id) => byId.get(id)).filter((img): img is GalleryImage => Boolean(img))
    );
  }, [counts, images]);

  async function verifyAccess(e: React.FormEvent) {
    e.preventDefault();
    setAccessError("");

    const res = await fetch(`/api/galleries/${galleryKey}/verify-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accessCode, pin: pin || undefined }),
    });

    if (!res.ok) {
      const data = await res.json();
      setAccessError(data.error ?? "Pristup nije dozvoljen.");
      return;
    }

    setAccessVerified(true);
  }

  function startAs(sender: string) {
    setActiveSender(sender);
    setCounts({});
    setNote("");
    setSuccessMsg("");
  }

  function addHeart(id: string) {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function removeHeart(id: string) {
    setCounts((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  }

  function openSubmitForm() {
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSender) return;
    setSubmitting(true);

    const res = await fetch(`/api/galleries/${galleryKey}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        senderRelation: activeSender,
        note: note.trim() || undefined,
        imageIds: expandImageIds(counts),
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      const emailPart = data.emailSent
        ? "Fotograf je obavešten emailom."
        : `Izbor je sačuvan, ali email fotografu nije stigao${data.emailError ? `: ${data.emailError}` : "."}`;

      setSuccessMsg(`Hvala, ${activeSender}! Poslato ${total} slika. ${emailPart}`);
      setCounts({});
      setNote("");
      setShowForm(false);
      setActiveSender(null);
      setTimeout(() => setSuccessMsg(""), 6000);
    } else {
      alert(data.error ?? "Slanje nije uspelo.");
    }
  }

  if (!accessVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={verifyAccess}
          className="glass-strong w-full max-w-sm rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-center font-display text-xl font-semibold text-gradient-accent">
            {gallery.title}
          </h2>
          <p className="text-center text-sm text-text-muted/60">
            Unesite kod albuma koji ste dobili od fotografa
          </p>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-accent/70">
              Kod albuma
            </label>
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-center text-lg font-semibold tracking-[0.3em] outline-none focus:border-accent/60"
              placeholder="ABC123"
              autoFocus
            />
          </div>
          {gallery.pin_hash && (
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-accent/70">
                Šifra
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
                placeholder="Šifra albuma"
              />
            </div>
          )}
          {accessError && (
            <p className="text-sm text-red-400 text-center">{accessError}</p>
          )}
          <button
            type="submit"
            className="btn-premium w-full rounded-xl py-3 text-sm font-semibold"
          >
            Uđi u album
          </button>
        </form>
      </div>
    );
  }

  if (!activeSender) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-strong w-full max-w-sm rounded-2xl p-6 space-y-5">
          <h2 className="text-center font-display text-xl font-semibold text-gradient-accent">
            Ko ste vi?
          </h2>
          <p className="text-center text-sm text-text-muted/60">
            Izaberite ko bira fotografije u albumu „{gallery.title}"
          </p>
          <div className="grid gap-2">
            {SENDER_RELATIONS.map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => startAs(rel)}
                className="btn-ghost rounded-xl py-3 text-sm font-medium transition hover:border-accent/50 hover:bg-accent/10"
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep pb-32">
      <AlbumHero
        title={gallery.title}
        hostsInfo={gallery.hosts_info ?? gallery.client_name}
        eventType={gallery.event_type}
        eventDate={gallery.event_date}
        coverImage={coverImage}
      />

      {successMsg && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {successMsg}
          </p>
        </div>
      )}

      <section id="album-gallery" className="relative mx-auto max-w-6xl px-3 py-10 sm:px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/70">
            Bira: <span className="text-accent">{activeSender}</span>
            <button
              type="button"
              onClick={() => setActiveSender(null)}
              className="ml-3 text-text-muted/50 underline-offset-2 hover:text-accent hover:underline"
            >
              promeni
            </button>
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-gradient-accent sm:text-3xl">
            Izaberite fotografije
          </h2>
          <p className="mt-2 text-sm text-text-muted/60">
            Kliknite srce na svaku sliku koju želite
          </p>
        </div>

        <MasonryGalleryGrid
          images={images}
          counts={counts}
          onAdd={addHeart}
          onRemove={removeHeart}
        />
        {images.length === 0 && (
          <p className="py-20 text-center text-text-muted/50">Album još nema slika.</p>
        )}
      </section>

      {total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-accent/25 bg-bg-deep/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-accent">{total} slika izabrano</p>
              <p className="text-xs text-text-muted/50">{summary.length} različitih fajlova</p>
            </div>
            <button
              onClick={openSubmitForm}
              className="btn-premium shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold animate-neon-pulse"
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
            <h3 className="font-display text-lg font-semibold">Potvrda slanja</h3>

            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-accent/70">Šalje</p>
                <select
                  value={activeSender}
                  onChange={(e) => setActiveSender(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm font-semibold text-accent outline-none focus:border-accent/60"
                >
                  {SENDER_RELATIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-accent/70">Broj slika</p>
                <p className="mt-1 text-2xl font-bold text-accent">{total}</p>
              </div>
              <ul className="max-h-28 space-y-1 overflow-y-auto text-sm text-text-muted/80">
                {summary.map((item) => (
                  <li key={item.filename} className="flex justify-between gap-2">
                    <span className="truncate">{item.filename}</span>
                    {item.quantity > 1 && (
                      <span className="shrink-0 text-accent">×{item.quantity}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-accent/70">
                Napomena
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-2.5 text-sm outline-none focus:border-accent/60 resize-none"
                placeholder="Npr. ove slike za album, ove za canvas..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost flex-1 rounded-xl py-2.5 text-sm"
              >
                Nazad
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
