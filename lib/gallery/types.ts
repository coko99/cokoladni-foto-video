export type Gallery = {
  id: string;
  slug: string;
  username: string | null;
  access_code: string;
  title: string;
  client_name: string;
  client_email: string;
  hosts_info: string | null;
  event_type: string | null;
  event_date: string | null;
  pin_hash: string | null;
  pin_plain: string | null;
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
  sender_relation: string;
  note: string | null;
  created_at: string;
};

export type SelectionWithImages = Selection & {
  images: GalleryImage[];
  total_count: number;
};

export type GalleryWithStats = Gallery & {
  image_count: number;
  selection_count: number;
};

export type SubmitSelectionPayload = {
  senderRelation: string;
  note?: string;
  imageIds: string[];
};

export type CreateGalleryPayload = {
  title: string;
  username: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  hostsInfo?: string;
  eventDate?: string;
  pin?: string;
};

export type ImageCounts = Record<string, number>;
