export const SENDER_RELATIONS = [
  "Majka",
  "Otac",
  "Sestra",
  "Brat",
  "Baba",
  "Deda",
  "Mladenac",
  "Mladenka",
  "Kum",
  "Kuma",
  "Gost",
  "Drugo",
] as const;

export type SenderRelation = (typeof SENDER_RELATIONS)[number];
