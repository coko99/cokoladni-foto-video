import type { Song } from "./types";

export function pickSongs(primary: Song[], extra: Song[], count = 50): Song[] {
  const seen = new Set<string>();
  const result: Song[] = [];

  for (const song of [...primary, ...extra]) {
    const key = `${song.title.toLowerCase()}|${song.artist.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(song);
    if (result.length >= count) break;
  }

  return result;
}
