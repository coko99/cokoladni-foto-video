import type { Gallery, GalleryImage } from "./types";

export function formatSelectionEmail(
  gallery: Pick<Gallery, "title" | "client_name">,
  client: {
    senderRelation: string;
    note?: string;
  },
  images: Pick<GalleryImage, "filename">[]
): { subject: string; text: string } {
  const counts = new Map<string, number>();
  for (const img of images) {
    counts.set(img.filename, (counts.get(img.filename) ?? 0) + 1);
  }

  const fileList = Array.from(counts.entries())
    .map(([name, qty]) => (qty > 1 ? `${name} x${qty}` : name))
    .join("\n");

  const total = images.length;
  const subject = `Novi izbor — ${gallery.title} · ${client.senderRelation}`;

  const lines = [
    `Novi izbor fotografija za galeriju "${gallery.title}"`,
    "",
    `Poslao/la: ${client.senderRelation}`,
    `Porodica: ${gallery.client_name}`,
  ];

  if (client.note) lines.push(`Napomena: ${client.note}`);

  lines.push(
    "",
    `Ukupno za izradu: ${total} slika`,
    `Različitih fajlova: ${counts.size}`,
    "",
    "── Spisak fajlova ──",
    fileList || "(nema izabranih slika)"
  );

  return { subject, text: lines.join("\n") };
}

export function groupImagesByFilename<T extends { filename: string }>(
  images: T[]
): { filename: string; quantity: number }[] {
  const counts = new Map<string, number>();
  for (const img of images) {
    counts.set(img.filename, (counts.get(img.filename) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([filename, quantity]) => ({
    filename,
    quantity,
  }));
}
