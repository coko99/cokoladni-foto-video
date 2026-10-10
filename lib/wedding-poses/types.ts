export type PoseSelectionState = "liked" | "disliked" | "neutral";

export type WeddingPoseCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  archived_at: string | null;
};

export type WeddingPose = {
  id: string;
  display_number: number;
  category_id: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  sort_order: number;
  archived_at: string | null;
};

export type WeddingPoseSubmissionStatus = "draft" | "submitted" | "updated";
export type WeddingPoseEmailStatus = "pending" | "sent" | "failed";

export type WeddingPoseSubmission = {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  city: string;
  shoot_location: string;
  celebration_venue: string | null;
  note: string | null;
  status: WeddingPoseSubmissionStatus;
  email_status: WeddingPoseEmailStatus;
  email_error: string | null;
  submitted_at: string | null;
  last_email_sent_at: string | null;
  updated_at: string;
  created_at: string;
};

export type CoupleFormData = {
  brideName: string;
  groomName: string;
  weddingDate: string;
  city: string;
  shootLocation: string;
  celebrationVenue?: string;
  note?: string;
};

export type PlannerStep = "landing" | "couple" | "gallery" | "review" | "success";

export function formatPoseNumber(displayNumber: number): string {
  return `#${String(displayNumber).padStart(3, "0")}`;
}
