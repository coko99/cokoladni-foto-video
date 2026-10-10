"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import type { CoupleFormData } from "@/lib/wedding-poses/types";

type Phase = "landing" | "form";

export function PozeLandingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CoupleFormData>({
    brideName: "",
    groomName: "",
    weddingDate: "",
    city: "",
    shootLocation: "",
    celebrationVenue: "",
    note: "",
  });

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/poze/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        celebrationVenue: form.celebrationVenue?.trim() || undefined,
        note: form.note?.trim() || undefined,
      }),
    });
    let data: { error?: string; token?: string } = {};
    try {
      data = await res.json();
    } catch {
      setError("Server nije odgovorio. Proverite da li je baza podešena.");
      setLoading(false);
      return;
    }
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Kreiranje nije uspelo.");
      return;
    }
    if (!data.token) {
      setError("Nedostaje link za nastavak. Kontaktirajte fotografa.");
      return;
    }
    router.push(`/poze/izbor/${data.token}`);
  }

  if (phase === "landing") {
    return (
      <div className="poze-app flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.45em] text-[#c9a962]"
        >
          Čokoladni Foto &amp; Video
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl"
        >
          Izaberite svoje kadrove
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-[#c9a962]/90"
        >
          Vaša ljubav. Vaš stil. Vaše uspomene.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/65"
        >
          Svaka ljubavna priča je posebna. Izaberite fotografije koje vas inspirišu, a mi ćemo se
          pobrinuti da vaše najlepše trenutke pretvorimo u uspomene.
        </motion.p>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="poze-btn-primary mt-10"
          onClick={() => setPhase("form")}
        >
          Započni izbor
        </motion.button>
      </div>
    );
  }

  return (
    <div className="poze-app min-h-screen px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="font-serif text-3xl text-white">Podaci o mladencima</h1>
        <p className="mt-2 text-sm text-white/60">Korak 1 — pre izbora fotografija</p>
        <form className="mt-8 space-y-4" onSubmit={handleStart}>
          {[
            ["Ime mlade *", "brideName"],
            ["Ime mladoženje *", "groomName"],
            ["Grad ili mesto *", "city"],
            ["Lokacija fotografisanja *", "shootLocation"],
            ["Restoran / proslava", "celebrationVenue"],
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">{label}</span>
              <input
                required={!label.includes("Restoran")}
                className="poze-input mt-1 w-full"
                value={form[key as keyof CoupleFormData] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">
              Datum venčanja *
            </span>
            <input
              type="date"
              required
              className="poze-input mt-1 w-full"
              value={form.weddingDate}
              onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">
              Napomena za fotografa
            </span>
            <textarea
              rows={3}
              className="poze-input mt-1 w-full resize-none"
              value={form.note ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </label>
          {error && <p className="text-sm text-red-300/90">{error}</p>}
          <button type="submit" className="poze-btn-primary w-full" disabled={loading}>
            {loading ? "Priprema…" : "Nastavi na izbor poza"}
          </button>
        </form>
      </div>
    </div>
  );
}
