import { packages, services, site } from "./content";

import { COKOLADNI_AGENT_GPT_URL } from "./cokoladni-agent";

export type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  links?: { label: string; href: string }[];
};

export const chatQuickReplies = [
  { id: "usluge", label: "Usluge" },
  { id: "paketi", label: "Paketi" },
  { id: "rezervacija", label: "Rezervacija" },
  { id: "kontakt", label: "Kontakt" },
  { id: "proces", label: "Kako radimo?" },
  { id: "pesme", label: "Pesme za veselja" },
];

const serviceList = services.map((s) => `• ${s.title}`).join("\n");
const packageList = packages
  .map(
    (p) =>
      `• **${p.name}**${p.highlighted ? " (preporučeno)" : ""} — ${p.description}`
  )
  .join("\n");

export const chatResponses: Record<string, Omit<ChatMessage, "id" | "role">> = {
  greeting: {
    text: `Zdravo! Ja sam **ČOKOLADNI AGENT** — AI asistent ${site.name}. Pitaj me o uslugama, paketima, rezervaciji ili pesmama za veselja. Piši slobodno!`,
    links: [
      { label: "Otvori u ChatGPT", href: COKOLADNI_AGENT_GPT_URL },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  usluge: {
    text: `Nudimo sledeće usluge:\n\n${serviceList}\n\nDetalje možete pogledati na stranici Usluge.`,
    links: [{ label: "Pogledaj usluge", href: "/usluge" }],
  },
  paketi: {
    text: `Naši paketi:\n\n${packageList}\n\nZa tačnu ponudu po vašem događaju, pošaljite upit.`,
    links: [
      { label: "Pogledaj pakete", href: "/paketi" },
      { label: "Pošalji upit", href: "/kontakt" },
    ],
  },
  rezervacija: {
    text: `Za rezervaciju termina najbolje je da nas kontaktirate direktno — proverićemo dostupnost za vaš datum i dogovoriti detalje.\n\n📞 ${site.phone}\n📍 ${site.location}`,
    links: [
      { label: "Kontakt stranica", href: "/kontakt" },
      { label: "Pozovi odmah", href: site.phoneHref },
    ],
  },
  kontakt: {
    text: `Možete nas kontaktirati na:\n\n📞 ${site.phone}\n📍 ${site.location}\n📸 Instagram: @cokoladni.foto\n✉️ ${site.email}`,
    links: [
      { label: "Kontakt stranica", href: "/kontakt" },
      { label: "Instagram", href: site.instagram },
    ],
  },
  proces: {
    text: `Naš proces u 4 koraka:\n\n1. Upoznavanje i dogovor\n2. Plan snimanja\n3. Fotografisanje i produkcija\n4. Obrada i isporuka\n\nSve je transparentno — bez iznenađenja.`,
    links: [{ label: "Više o procesu", href: "/proces" }],
  },
  pesme: {
    text: `Na sajtu imamo preporuke pesama za veselja — po kategorijama: za mladu, mladoženja, venčanje, krštenje i rođenje deteta. Svaka kategorija ima 50 pesama sa titlovima.`,
    links: [{ label: "Pesme za veselja", href: "/pesme" }],
  },
  cena: {
    text: `Cena zavisi od vrste događaja, trajanja snimanja i paketa koji izaberete. Pošaljite upit sa datumom i tipom proslave — pripremićemo personalizovanu ponudu.`,
    links: [{ label: "Pošalji upit", href: "/kontakt" }],
  },
  portfolio: {
    text: `Pogledajte naše radove — svadbe, krštenja, rođendane, studio, video i dron snimci u cinematic stilu.`,
    links: [{ label: "Portfolio", href: "/portfolio" }],
  },
  fallback: {
    text: `Hvala na pitanju! Za detaljniji odgovor najbolje je da nas kontaktirate direktno na ${site.phone} ili putem Instagrama. Takođe možete pogledati naše usluge i pakete na sajtu.`,
    links: [
      { label: "Kontakt", href: "/kontakt" },
      { label: "Usluge", href: "/usluge" },
    ],
  },
};

const keywordMap: { keywords: string[]; key: keyof typeof chatResponses }[] = [
  { keywords: ["uslug", "snim", "foto", "video", "dron", "reels", "studio", "svadb", "krst", "rodend"], key: "usluge" },
  { keywords: ["paket", "ponud", "premium", "plan"], key: "paketi" },
  { keywords: ["rezerv", "termin", "datum", "zakaž", "zakaz"], key: "rezervacija" },
  { keywords: ["kontakt", "telefon", "pozov", "instagram", "mail", "email", "gde ste", "lokacij", "kruševac", "krusevac"], key: "kontakt" },
  { keywords: ["proces", "kako rad", "korak", "isporuk"], key: "proces" },
  { keywords: ["pesm", "muzik", "veselj", "mlad", "mladoženj", "venčanj", "krštenj"], key: "pesme" },
  { keywords: ["cen", "koliko", "košta", "kosta", "plac", "plać"], key: "cena" },
  { keywords: ["portfolio", "radov", "galerij", "primer"], key: "portfolio" },
  { keywords: ["zdravo", "ćao", "cao", "pozdrav", "hej", "hello", "hi"], key: "greeting" },
];

export function getBotResponse(input: string): Omit<ChatMessage, "id" | "role"> {
  const normalized = input.toLowerCase().trim();

  for (const { keywords, key } of keywordMap) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return chatResponses[key];
    }
  }

  return chatResponses.fallback;
}

export function getQuickReplyResponse(
  replyId: string
): Omit<ChatMessage, "id" | "role"> {
  const key = replyId as keyof typeof chatResponses;
  return chatResponses[key] ?? chatResponses.fallback;
}
