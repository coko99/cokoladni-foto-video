"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dogadjajOptions, uslugaOptions } from "@/lib/contact-form";
import { OptionPicker } from "@/components/ui/OptionPicker";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent/50 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-accent";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dogadjaj, setDogadjaj] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!dogadjaj) {
      setErrorMsg("Izaberite tip događaja.");
      setStatus("error");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.dogadjaj = dogadjaj;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Slanje nije uspelo.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setDogadjaj("");
    } catch {
      setErrorMsg("Greška u mreži. Proverite konekciju i pokušajte ponovo.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ime" className={labelClass}>
            Ime *
          </label>
          <input
            id="ime"
            name="ime"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Vaše ime"
          />
        </div>
        <div>
          <label htmlFor="telefon" className={labelClass}>
            Telefon *
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="06X XXX XXXX"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input type="hidden" name="dogadjaj" value={dogadjaj} />
          <OptionPicker
            label="Događaj"
            options={dogadjajOptions.map((opt) => ({ value: opt, label: opt }))}
            value={dogadjaj}
            onChange={setDogadjaj}
            required
            placeholder="Izaberi tip događaja"
          />
        </div>
        <div>
          <label htmlFor="datum" className={labelClass}>
            Datum
          </label>
          <input id="datum" name="datum" type="date" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="grad" className={labelClass}>
            Grad / lokacija
          </label>
          <input
            id="grad"
            name="grad"
            type="text"
            className={inputClass}
            placeholder="npr. Kruševac"
          />
        </div>
        <div>
          <label htmlFor="restoran" className={labelClass}>
            Restoran / sala
          </label>
          <input
            id="restoran"
            name="restoran"
            type="text"
            className={inputClass}
            placeholder="Naziv restorana ili sale"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="brojGostiju" className={labelClass}>
            Broj gostiju
          </label>
          <input
            id="brojGostiju"
            name="brojGostiju"
            type="text"
            inputMode="numeric"
            className={inputClass}
            placeholder="npr. 150"
          />
        </div>
        <div>
          <span className={labelClass}>Foto, video ili oba *</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {uslugaOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition has-[:checked]:border-accent/50 has-[:checked]:bg-accent/15 has-[:checked]:text-accent"
              >
                <input
                  type="radio"
                  name="usluga"
                  value={opt.value}
                  required
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="posebneZelje" className={labelClass}>
          Posebne želje
        </label>
        <textarea
          id="posebneZelje"
          name="posebneZelje"
          rows={4}
          className={`${inputClass} resize-y min-h-[100px]`}
          placeholder="Sve što želite da znamo o vašem događaju..."
        />
      </div>

      {/* Honeypot — hidden from users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden
      />

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="btn-premium w-full rounded-full py-3.5 text-sm font-semibold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
      >
        {status === "loading" ? "Šaljem..." : "Pošalji upit"}
      </button>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent"
          >
            Hvala! Upit je poslat — javićemo vam se uskoro.
          </motion.p>
        )}
        {status === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
