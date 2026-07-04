const WHATSAPP_NUMBER = "381621872069";

export type WhatsAppInquiry = {
  datum: string;
  dogadjaj: string;
  restoran: string;
  brojGostiju: string;
  usluga?: string;
  vencanjeScenario?: string;
  brojFotografa?: string;
  brojVideografa?: string;
  poruka?: string;
};

export const vencanjeScenarioOptions = [
  { value: "po-mladu", label: "Ide se po mladu" },
  { value: "jedna-kuca", label: "Izlazak iz jedne kuće" },
  { value: "nisam-siguran", label: "Još nisam siguran" },
];

export const crewCountOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3+", label: "3 ili više" },
  { value: "dogovor", label: "Po dogovoru" },
];

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}

export function openWhatsApp(text?: string) {
  window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}

export function formatWhatsAppInquiry(data: WhatsAppInquiry) {
  const lines = [
    "Zdravo! Šaljem neobavezni upit preko sajta Čokoladni Foto & Video:",
    "",
    `📅 Datum: ${data.datum || "—"}`,
    `🎉 Događaj: ${data.dogadjaj || "—"}`,
    `🏛 Restoran/sala: ${data.restoran || "—"}`,
    `👥 Broj gostiju: ${data.brojGostiju || "—"}`,
  ];

  if (data.usluga) {
    lines.push(`📷 Usluga: ${data.usluga}`);
  }

  if (data.dogadjaj === "Venčanje") {
    const scenarioLabel =
      vencanjeScenarioOptions.find((o) => o.value === data.vencanjeScenario)
        ?.label ?? data.vencanjeScenario;
    if (scenarioLabel) {
      lines.push(`💒 Scenario venčanja: ${scenarioLabel}`);
    }
  }

  if (
    data.dogadjaj === "Venčanje" ||
    data.dogadjaj === "Krštenje" ||
    data.dogadjaj === "18. rođendan"
  ) {
    if (data.brojFotografa) {
      const fotoLabel =
        crewCountOptions.find((o) => o.value === data.brojFotografa)?.label ??
        data.brojFotografa;
      lines.push(`📸 Broj fotografa: ${fotoLabel}`);
    }
    if (data.brojVideografa) {
      const videoLabel =
        crewCountOptions.find((o) => o.value === data.brojVideografa)?.label ??
        data.brojVideografa;
      lines.push(`🎬 Broj videografa: ${videoLabel}`);
    }
  }

  if (data.poruka?.trim()) {
    lines.push("", `💬 Poruka: ${data.poruka.trim()}`);
  }

  lines.push(
    "",
    "ℹ️ Napomena: Ovo je informativni upit. Slanjem poruke ne rezervišem termin automatski.",
    "Nakon upita poslaćemo vam ponudu prilagođenu vašoj proslavi."
  );

  return lines.join("\n");
}
