import type { Gallery, GalleryImage } from "./types";

export function formatSelectionEmail(
  gallery: Pick<Gallery, "title" | "client_name">,
  client: { name: string; email: string; phone?: string; note?: string },
  images: Pick<GalleryImage, "filename">[]
): { subject: string; text: string } {
  const fileList = images.map((img) => img.filename).join("\n");
  const subject = `Novi izbor slika — ${gallery.title} · ${client.name}`;

  const lines = [
    `Novi izbor fotografija za galeriju "${gallery.title}"`,
    "",
    `Klijent: ${client.name}`,
    `Email: ${client.email}`,
  ];

  if (client.phone) lines.push(`Telefon: ${client.phone}`);
  if (client.note) lines.push(`Napomena: ${client.note}`);

  lines.push(
    "",
    `Izabrano slika: ${images.length}`,
    "",
    "── Spisak fajlova ──",
    fileList || "(nema izabranih slika)"
  );

  return { subject, text: lines.join("\n") };
}
