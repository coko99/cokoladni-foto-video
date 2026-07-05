import { CreateGalleryForm } from "@/components/gallery/AdminGallery";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Nova galerija | Admin",
  "Kreirajte novu privatnu galeriju za klijenta."
);

export default function NewGalleryPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Nova galerija</h1>
      <CreateGalleryForm />
    </div>
  );
}
