export type Gallery = {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_email: string;
  pin_hash: string | null;
  max_selections: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  gallery_id: string;
  storage_path: string;
  filename: string;
  sort_order: number;
  created_at: string;
};

export type Selection = {
  id: string;
  gallery_id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  note: string | null;
  created_at: string;
};

export type SelectionWithImages = Selection & {
  images: GalleryImage[];
};

export type GalleryWithStats = Gallery & {
  image_count: number;
  selection_count: number;
};

export type SubmitSelectionPayload = {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  note?: string;
  imageIds: string[];
};

export type CreateGalleryPayload = {
  title: string;
  clientName: string;
  clientEmail: string;
  pin?: string;
  maxSelections?: number;
};
