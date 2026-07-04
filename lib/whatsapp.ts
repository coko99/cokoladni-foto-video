const WHATSAPP_NUMBER = "381621872069";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}

export function openWhatsApp(text?: string) {
  window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}

export const whatsappQuickMessages = [
  {
    id: "vencanje",
    label: "Venčanje",
    message: "Zdravo! Zanima me fotografisanje i snimanje venčanja.",
  },
  {
    id: "datum",
    label: "Proveri datum",
    message: "Zdravo! Da li ste slobodni za moj datum? Pišem u vezi rezervacije.",
  },
  {
    id: "paketi",
    label: "Paketi",
    message: "Zdravo! Možete li mi poslati ponudu za foto + video paket?",
  },
  {
    id: "kontakt",
    label: "Brzi upit",
    message: "Zdravo! Imam pitanje u vezi vaših usluga.",
  },
];
