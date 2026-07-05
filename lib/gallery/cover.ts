import type { Gallery, GalleryImage } from "./types";

export function getGalleryCoverImage(
  gallery: Pick<Gallery, "hero_image_id">,
  images: GalleryImage[]
): GalleryImage | null {
  if (gallery.hero_image_id) {
    const hero = images.find((img) => img.id === gallery.hero_image_id);
    if (hero) return hero;
  }
  return images[0] ?? null;
}
