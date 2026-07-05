export const EVENT_TYPES: string[] = [
  "Svadba",
  "Krštenje",
  "Rođendan",
  "18. rođendan",
  "Proslava",
  "Porodično snimanje",
  "Studio / portret",
  "Drugo",
];

export function isEventType(value: string): boolean {
  return EVENT_TYPES.includes(value);
}
