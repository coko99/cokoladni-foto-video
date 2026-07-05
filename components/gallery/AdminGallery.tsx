"use client";

import { useState } from "react";
import Link from "next/link";
import type { GalleryWithStats } from "@/lib/gallery/types";
import { galleryPublicUrl } from "@/lib/gallery/utils";
import { EVENT_TYPES } from "@/lib/gallery/event-types";

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
          {g.event_type && (
            <p className="mt-1 text-xs text-accent/70">{g.event_type}</p>
          )}
          <div className="mt-4 flex gap-4 text-xs text-accent/70">
            <span>{g.image_count} slika</span>
            <span>{g.selection_count} izbora</span>
            {g.pin_hash && <span>🔒 PIN</span>}
          </div>
          <p className="mt-2 text-xs text-text-muted/40 truncate">
            {galleryPublicUrl(g.username ?? g.slug)}
          </p>
          {g.access_code && (
            <p className="mt-1 text-xs font-mono text-accent/60">Kod: {g.access_code}</p>
          )}
        </Link>
      ))}
    </div>
  );
}

export function CreateGalleryForm() {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventType, setEventType] = useState<string>("Svadba");
  const [hostsInfo, setHostsInfo] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleEventTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEventType(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        username,
        clientName,
        clientEmail,
        eventType,
        hostsInfo: hostsInfo || undefined,
        eventDate: eventDate || undefined,
        pin: pin || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Greška pri kreiranju.");
      setLoading(false);
      return;
    }

    if (pin.trim()) {
      sessionStorage.setItem(`gallery-pin-${data.gallery.id}`, pin.trim());
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
          Tip događaja
        </label>
        <select
          value={eventType}
          onChange={handleEventTypeChange}
          required
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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
          Domaćini (prikazuje se na hero)
        </label>
        <input
          value={hostsInfo}
          onChange={(e) => setHostsInfo(e.target.value)}
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="Marko & Ana"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Datum događaja
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Username albuma
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="marko-ana-svadba"
        />
        <p className="mt-1.5 text-xs text-text-muted/50">
          Link: /g/username · Kod albuma se automatski generiše
        </p>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
          Šifra albuma — opciono
        </label>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60"
          placeholder="npr. 1234"
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
