export type TileSize = "small" | "tall" | "wide" | "large";

const PATTERN: TileSize[] = [
  "large",
  "small",
  "tall",
  "small",
  "wide",
  "small",
  "tall",
  "small",
  "wide",
  "large",
  "small",
];

export function getTileSize(index: number, aspectRatio?: number): TileSize {
  if (aspectRatio && aspectRatio > 0) {
    if (aspectRatio >= 1.5) return index % 3 === 0 ? "wide" : "small";
    if (aspectRatio <= 0.7) return index % 3 === 0 ? "tall" : "small";
    if (aspectRatio >= 1.1 && index % 5 === 0) return "wide";
    if (aspectRatio <= 0.85 && index % 5 === 0) return "tall";
  }
  return PATTERN[index % PATTERN.length];
}

export const tileClasses: Record<TileSize, string> = {
  small: "col-span-1 row-span-2",
  tall: "col-span-1 row-span-2 sm:row-span-3",
  wide: "col-span-1 row-span-2 sm:col-span-2",
  large: "col-span-1 row-span-2 sm:col-span-2 md:row-span-3",
};
