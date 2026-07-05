export const EVENT_TYPES = [
  "Svadba",
  "Krštenje",
  "Rođendan",
  "18. rođendan",
  "Proslava",
  "Porodično snimanje",
  "Studio / portret",
  "Drugo",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export function isEventType(value: string): value is EventType {
  return (EVENT_TYPES as readonly string[]).includes(value);
}
