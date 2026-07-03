export type ContactFormData = {
  ime: string;
  telefon: string;
  dogadjaj: string;
  datum: string;
  grad: string;
  restoran: string;
  brojGostiju: string;
  usluga: "foto" | "video" | "oba";
  posebneZelje: string;
};

export const dogadjajOptions = [
  "Venčanje",
  "Krštenje",
  "18. rođendan",
  "Proslava",
  "Porodično snimanje",
  "Studio / portret",
  "Drugo",
];

export const uslugaOptions = [
  { value: "foto" as const, label: "Foto" },
  { value: "video" as const, label: "Video" },
  { value: "oba" as const, label: "Foto i video" },
];

export function formatContactEmail(data: ContactFormData) {
  const uslugaLabel =
    uslugaOptions.find((o) => o.value === data.usluga)?.label ?? data.usluga;

  return `Pregled upita:

Ime: ${data.ime}
Telefon: ${data.telefon}
Događaj: ${data.dogadjaj}
Datum: ${data.datum || "—"}
Grad/lokacija: ${data.grad || "—"}
Restoran/sala: ${data.restoran || "—"}
Broj gostiju: ${data.brojGostiju || "—"}
Da li želiš foto, video ili oba: ${uslugaLabel}
Posebne želje: ${data.posebneZelje || "—"}`;
}

export function validateContactForm(body: unknown): {
  ok: true;
  data: ContactFormData;
} | {
  ok: false;
  error: string;
} {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Neispravan zahtev." };
  }

  const raw = body as Record<string, unknown>;

  const ime = String(raw.ime ?? "").trim();
  const telefon = String(raw.telefon ?? "").trim();
  const dogadjaj = String(raw.dogadjaj ?? "").trim();
  const usluga = String(raw.usluga ?? "").trim();

  if (!ime || ime.length < 2) {
    return { ok: false, error: "Unesite ime." };
  }
  if (!telefon || telefon.length < 6) {
    return { ok: false, error: "Unesite ispravan broj telefona." };
  }
  if (!dogadjaj) {
    return { ok: false, error: "Izaberite tip događaja." };
  }
  if (!["foto", "video", "oba"].includes(usluga)) {
    return { ok: false, error: "Izaberite foto, video ili oba." };
  }

  // Honeypot — bots fill hidden website field
  if (String(raw.website ?? "").trim()) {
    return { ok: false, error: "Neispravan zahtev." };
  }

  return {
    ok: true,
    data: {
      ime,
      telefon,
      dogadjaj,
      datum: String(raw.datum ?? "").trim(),
      grad: String(raw.grad ?? "").trim(),
      restoran: String(raw.restoran ?? "").trim(),
      brojGostiju: String(raw.brojGostiju ?? "").trim(),
      usluga: usluga as ContactFormData["usluga"],
      posebneZelje: String(raw.posebneZelje ?? "").trim(),
    },
  };
}
