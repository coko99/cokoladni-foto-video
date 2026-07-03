import type { Song } from "@/lib/songs/types";

type SongListProps = {
  songs: Song[];
};

export function SongList({ songs }: SongListProps) {
  return (
    <ul className="mt-6 max-h-[min(60vh,520px)] divide-y divide-white/8 overflow-y-auto pr-1 md:mt-8">
      {songs.map((song, index) => (
        <li
          key={`${song.title}-${index}`}
          className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
        >
          <span className="neon-border flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent sm:h-10 sm:w-10 sm:text-sm">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-text-primary">{song.title}</p>
            <p className="text-sm text-text-muted">{song.artist}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
