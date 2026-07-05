"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "admin" | "client";

export function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [albumUsername, setAlbumUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Pogrešan email ili lozinka.");
      setLoading(false);
      return;
    }

    router.push(redirect ?? "/admin");
    router.refresh();
  }

  async function handleClientAccess(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = albumUsername.trim().toLowerCase().replace(/^\/g\//, "");

    if (!username || !accessCode.trim()) {
      setError("Unesite username i kod albuma.");
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/galleries/${username}/verify-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessCode: accessCode.trim(),
        pin: pin.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Pristup nije dozvoljen.");
      setLoading(false);
      return;
    }

    router.push(`/g/${username}`);
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-gradient-accent">
          Čokoladni Galerija
        </h1>
        <p className="mt-2 text-sm text-text-muted/70">
          Prijava za fotografa ili pristup galeriji
        </p>
      </div>

      <div className="mb-6 flex rounded-2xl border border-accent/20 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => { setTab("admin"); setError(""); }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            tab === "admin"
              ? "bg-accent/15 text-accent shadow-[0_0_20px_rgba(101,227,255,0.15)]"
              : "text-text-muted/60 hover:text-text-muted"
          }`}
        >
          Fotograf
        </button>
        <button
          type="button"
          onClick={() => { setTab("client"); setError(""); }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            tab === "client"
              ? "bg-accent/15 text-accent shadow-[0_0_20px_rgba(101,227,255,0.15)]"
              : "text-text-muted/60 hover:text-text-muted"
          }`}
        >
          Klijent
        </button>
      </div>

      {tab === "admin" ? (
        <form onSubmit={handleAdminLogin} className="glass-strong rounded-2xl p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60 focus:shadow-[0_0_20px_rgba(101,227,255,0.15)]"
              placeholder="admin@cokoladni.rs"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60 focus:shadow-[0_0_20px_rgba(101,227,255,0.15)]"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleClientAccess} className="glass-strong rounded-2xl p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
              Username albuma
            </label>
            <input
              type="text"
              value={albumUsername}
              onChange={(e) => setAlbumUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60 focus:shadow-[0_0_20px_rgba(101,227,255,0.15)]"
              placeholder="marko-ana-svadba"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
              Kod albuma
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-center text-lg font-semibold tracking-[0.3em] outline-none focus:border-accent/60"
              placeholder="ABC123"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent/80">
              Šifra — ako postoji
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-4 py-3 text-sm outline-none focus:border-accent/60 focus:shadow-[0_0_20px_rgba(101,227,255,0.15)]"
              placeholder="Opciono"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Provera..." : "Uđi u album"}
          </button>
        </form>
      )}
    </div>
  );
}
