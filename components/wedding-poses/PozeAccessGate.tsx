"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export function PozeAccessGate({ children }: Props) {
  const [status, setStatus] = useState<"loading" | "locked" | "open">("loading");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/poze/access", { credentials: "same-origin" });
        const data = await res.json();
        if (!cancelled) setStatus(data.ok ? "open" : "locked");
      } catch {
        if (!cancelled) setStatus("locked");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/poze/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "PIN nije ispravan.");
        setSubmitting(false);
        return;
      }
      setStatus("open");
    } catch {
      setError("Provera PIN-a nije uspela. Pokušajte ponovo.");
    }
    setSubmitting(false);
  }

  if (status === "loading") {
    return (
      <div className="poze-app flex min-h-screen items-center justify-center text-white/50">
        Učitavanje…
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="poze-app flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-[#c9a962]">Čokoladni Foto &amp; Video</p>
          <h1 className="mt-6 font-serif text-3xl text-white">Izbor poza</h1>
          <p className="mt-3 text-sm text-white/60">Unesite PIN koji ste dobili od fotografa.</p>
          <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">PIN</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={12}
                required
                className="poze-input mt-1 w-full text-center text-lg tracking-[0.35em]"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\s/g, ""))}
              />
            </label>
            {error && <p className="text-center text-sm text-red-300/90">{error}</p>}
            <button type="submit" className="poze-btn-primary w-full" disabled={submitting}>
              {submitting ? "Provera…" : "Nastavi"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
