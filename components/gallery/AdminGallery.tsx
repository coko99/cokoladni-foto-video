"use client";

import { useState } from "react";
import Link from "next/link";
import type { GalleryWithStats } from "@/lib/gallery/types";
import { galleryPublicUrl } from "@/lib/gallery/utils";

export function GalleryList({ galleries }: { galleries: GalleryWithStats[] }) {
  if (!galleries.length) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-text-muted/60">Još nema galerija.</p>
        <Link
          href="/admin/galleries/new"
          className="btn-premium mt-4 inline-flex rounded-xl px-6 py-2.5 text-sm"
        >
          Kreiraj prvu galeriju
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleries.map((g) => (
        <Link
          key={g.id}
          href={`/admin/galleries/${g.id}`}
          className="glass card-glow rounded-2xl p-5 transition-all hover:border-accent/40"
        >
          <h3 className="font-semibold text-text-primary truncate">{g.title}</h3>
          <p className="mt-1 text-sm text-text-muted/60 truncate">{g.client_name}</p>
          <div className="mt-4 flex gap-4 text-xs text-accent/70">
            <span>{g.image_count} slika</span>
            <span>{g.selection_count} izbora</span>
            {g.pin_hash && <span>🔒 PIN</span>}
          </div>
          <p className="mt-2 text-xs text-text-muted/40 truncate">
            {galleryPublicUrl(g.slug)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function CreateGalleryForm() {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [pin, setPin] = useState("");
  const [maxSelections, setMaxSelections] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        clientName,
        clientEmail,
        pin: pin || undefined,
        maxSelections: maxSelections ? parseInt(maxSelections, 10) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Greška pri kreiranju.");
      setLoading(false);
      return;
    }

    window.location.href = `/admin/galleries/${data.gallery.id}`;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong max-w-lg rounded-2xl p-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Naziv galerije / događaj
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="Svadba Marko & Ana"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Ime klijenta
        </label>
        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Email klijenta
        </label>
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Šifra (PIN) — opciono
        </label>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="npr. 1234"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Max broj izbora — opciono
        </label>
        <input
          type="number"
          value={maxSelections}
          onChange={(e) => setMaxSelections(e.target.value)}
          min={1}
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="npr. 20 za album"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-premium w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? "Kreiranje..." : "Kreiraj galeriju"}
      </button>
    </form>
  );
}
