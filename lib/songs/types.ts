export type Song = {
  title: string;
  artist: string;
};

export type SongCategory = {
  id: string;
  label: string;
  songs: Song[];
};
