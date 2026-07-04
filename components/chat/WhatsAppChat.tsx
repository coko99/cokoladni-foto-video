"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/content";
import { dogadjajOptions, uslugaOptions } from "@/lib/contact-form";
import {
  crewCountOptions,
  formatWhatsAppInquiry,
  openWhatsApp,
  vencanjeScenarioOptions,
  whatsappUrl,
  type WhatsAppInquiry,
} from "@/lib/whatsapp";
import {
  chatPanelDesktop,
  chatPanelMobile,
  chatFabBase,
  chatFabBottom,
} from "@/components/chat/chat-styles";
import { OptionPicker } from "@/components/ui/OptionPicker";

const dogadjajPickerOptions = dogadjajOptions.map((opt) => ({
  value: opt,
  label: opt,
}));

const crewPickEvents = new Set(["Venčanje", "Krštenje", "18. rođendan"]);

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-dim outline-none transition focus:border-[#25D366]/40 focus:ring-1 focus:ring-[#25D366]/20 [color-scheme:dark]";

const labelClass =
  "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#25D366]";

type WhatsAppChatProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyForm: WhatsAppInquiry = {
  datum: "",
  dogadjaj: "",
  restoran: "",
  brojGostiju: "",
  usluga: "",
  vencanjeScenario: "",
  brojFotografa: "",
  brojVideografa: "",
  poruka: "",
};

export function WhatsAppChat({ open, onOpenChange }: WhatsAppChatProps) {
  const [form, setForm] = useState<WhatsAppInquiry>(emptyForm);
  const isVencanje = form.dogadjaj === "Venčanje";
  const showCrewPick = crewPickEvents.has(form.dogadjaj);

  const update = (key: keyof WhatsAppInquiry, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "dogadjaj") {
        if (value !== "Venčanje") {
          next.vencanjeScenario = "";
        }
        if (!crewPickEvents.has(value)) {
          next.brojFotografa = "";
          next.brojVideografa = "";
        }
      }
      return next;
    });
  };

  const sendMessage = (text: string) => {
    openWhatsApp(text);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const uslugaLabel =
      uslugaOptions.find((o) => o.value === form.usluga)?.label ?? form.usluga;

    sendMessage(
      formatWhatsAppInquiry({
        ...form,
        usluga: uslugaLabel || undefined,
      })
    );
    setForm(emptyForm);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`${chatPanelMobile} ${chatPanelDesktop} sm:max-h-[min(92dvh,680px)] rounded-2xl border border-[#25D366]/30 bg-[#05070d]/95 shadow-[0_0_60px_rgba(37,211,102,0.12)] backdrop-blur-xl sm:right-8`}
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">WhatsApp upit</p>
              <p className="text-xs text-[#25D366]">{site.phone}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Zatvori"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
              <div className="rounded-xl border border-[#25D366]/25 bg-[#25D366]/8 px-3 py-2.5">
                <p className="text-xs leading-relaxed text-text-muted">
                  <span className="font-medium text-[#25D366]">Neobavezni upit.</span>{" "}
                  Popuni šta znaš — otvoriće se WhatsApp sa porukom. Slanjem{" "}
                  <span className="text-text-primary">ne rezervišeš termin</span>{" "}
                  automatski.{" "}
                  <span className="text-text-primary">
                    Nakon upita poslaćemo vam ponudu
                  </span>{" "}
                  prilagođenu vašoj proslavi.
                </p>
              </div>

              <div>
                <label htmlFor="wa-datum" className={labelClass}>
                  Datum događaja
                </label>
                <input
                  id="wa-datum"
                  type="date"
                  value={form.datum}
                  onChange={(e) => update("datum", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={fieldClass}
                />
              </div>

              <OptionPicker
                label="Šta je u pitanju?"
                options={dogadjajPickerOptions}
                value={form.dogadjaj}
                onChange={(v) => update("dogadjaj", v)}
                placeholder="Opciono — izaberi događaj"
                accent="green"
              />

              {isVencanje && (
                <OptionPicker
                  label="Venčanje — scenario"
                  options={vencanjeScenarioOptions}
                  value={form.vencanjeScenario ?? ""}
                  onChange={(v) => update("vencanjeScenario", v)}
                  placeholder="Ide se po mladu ili iz jedne kuće?"
                  accent="green"
                />
              )}

              {showCrewPick && (
                <>
                  <OptionPicker
                    label="Koliko fotografa želite?"
                    options={crewCountOptions}
                    value={form.brojFotografa ?? ""}
                    onChange={(v) => update("brojFotografa", v)}
                    accent="green"
                  />
                  <OptionPicker
                    label="Koliko videografa želite?"
                    options={crewCountOptions}
                    value={form.brojVideografa ?? ""}
                    onChange={(v) => update("brojVideografa", v)}
                    accent="green"
                  />
                </>
              )}

              <div>
                <label htmlFor="wa-restoran" className={labelClass}>
                  Restoran / sala
                </label>
                <input
                  id="wa-restoran"
                  type="text"
                  value={form.restoran}
                  onChange={(e) => update("restoran", e.target.value)}
                  placeholder="npr. Sala X, Kruševac"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="wa-gosti" className={labelClass}>
                  Broj gostiju
                </label>
                <input
                  id="wa-gosti"
                  type="number"
                  min={1}
                  max={9999}
                  value={form.brojGostiju}
                  onChange={(e) => update("brojGostiju", e.target.value)}
                  placeholder="npr. 120"
                  className={fieldClass}
                />
              </div>

              <OptionPicker
                label="Foto / video"
                options={uslugaOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                value={form.usluga ?? ""}
                onChange={(v) => update("usluga", v)}
                accent="green"
              />

              <div>
                <label htmlFor="wa-poruka" className={labelClass}>
                  Dodatna poruka
                </label>
                <textarea
                  id="wa-poruka"
                  rows={2}
                  value={form.poruka}
                  onChange={(e) => update("poruka", e.target.value)}
                  placeholder="Posebne želje, pitanja..."
                  className={`${fieldClass} resize-none`}
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 px-3 py-2.5">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-[#05070D] transition hover:bg-[#20bd5a]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pošalji na WhatsApp
              </button>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs text-[#25D366] transition hover:underline"
              >
                Otvori prazan WhatsApp chat
              </a>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppChatButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${chatFabBase} ${chatFabBottom} right-3 border border-[#25D366]/50 bg-[#05070d]/90 shadow-[0_0_40px_rgba(37,211,102,0.25)] hover:shadow-[0_0_50px_rgba(37,211,102,0.4)] sm:right-8`}
      aria-label={open ? "Zatvori WhatsApp" : "Otvori WhatsApp chat"}
      aria-expanded={open}
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.svg
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-[#25D366]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        ) : (
          <motion.svg
            key="whatsapp"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-[#25D366]"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
