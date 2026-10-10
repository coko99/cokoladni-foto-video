-- Wedding Pose Planner — run in Supabase SQL Editor
-- Bucket: create "wedding-poses" (public) in Storage if not exists

CREATE SEQUENCE IF NOT EXISTS wedding_pose_display_number_seq START 1;

CREATE TABLE IF NOT EXISTS wedding_pose_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_poses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_number int NOT NULL UNIQUE DEFAULT nextval('wedding_pose_display_number_seq'),
  category_id uuid REFERENCES wedding_pose_categories(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  thumbnail_path text,
  sort_order int NOT NULL DEFAULT 0,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wedding_poses_category_idx ON wedding_poses(category_id);
CREATE INDEX IF NOT EXISTS wedding_poses_active_idx ON wedding_poses(archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS wedding_poses_sort_idx ON wedding_poses(sort_order, display_number);

CREATE TABLE IF NOT EXISTS wedding_pose_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token_hash text NOT NULL UNIQUE,
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  wedding_date date NOT NULL,
  city text NOT NULL,
  shoot_location text NOT NULL,
  celebration_venue text,
  note text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'updated')),
  email_status text NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
  email_error text,
  submitted_at timestamptz,
  last_email_sent_at timestamptz,
  token_expires_at timestamptz,
  token_revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wedding_pose_submissions_status_idx ON wedding_pose_submissions(status, created_at DESC);

CREATE TABLE IF NOT EXISTS wedding_pose_selections (
  submission_id uuid NOT NULL REFERENCES wedding_pose_submissions(id) ON DELETE CASCADE,
  pose_id uuid NOT NULL REFERENCES wedding_poses(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'neutral' CHECK (state IN ('liked', 'disliked', 'neutral')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (submission_id, pose_id)
);

CREATE INDEX IF NOT EXISTS wedding_pose_selections_liked_idx
  ON wedding_pose_selections(submission_id) WHERE state = 'liked';

CREATE TABLE IF NOT EXISTS wedding_pose_shot_checklist (
  submission_id uuid NOT NULL REFERENCES wedding_pose_submissions(id) ON DELETE CASCADE,
  pose_id uuid NOT NULL REFERENCES wedding_poses(id) ON DELETE CASCADE,
  shot boolean NOT NULL DEFAULT false,
  shot_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (submission_id, pose_id)
);

CREATE TABLE IF NOT EXISTS wedding_pose_notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES wedding_pose_submissions(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('initial', 'resend', 'updated')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE wedding_pose_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_poses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_pose_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_pose_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_pose_shot_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_pose_notification_outbox ENABLE ROW LEVEL SECURITY;

-- No public policies: all access via service role on server routes.

CREATE OR REPLACE FUNCTION wedding_pose_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wedding_pose_categories_updated ON wedding_pose_categories;
CREATE TRIGGER wedding_pose_categories_updated
  BEFORE UPDATE ON wedding_pose_categories
  FOR EACH ROW EXECUTE FUNCTION wedding_pose_set_updated_at();

DROP TRIGGER IF EXISTS wedding_poses_updated ON wedding_poses;
CREATE TRIGGER wedding_poses_updated
  BEFORE UPDATE ON wedding_poses
  FOR EACH ROW EXECUTE FUNCTION wedding_pose_set_updated_at();

DROP TRIGGER IF EXISTS wedding_pose_submissions_updated ON wedding_pose_submissions;
CREATE TRIGGER wedding_pose_submissions_updated
  BEFORE UPDATE ON wedding_pose_submissions
  FOR EACH ROW EXECUTE FUNCTION wedding_pose_set_updated_at();

-- Podrazumevane kategorije (opciono — preskoči ako već postoje)
INSERT INTO wedding_pose_categories (name, slug, sort_order) VALUES
  ('Mladenci zajedno', 'mladenci-zajedno', 1),
  ('Samo mlada', 'samo-mlada', 2),
  ('Samo mladoženje', 'samo-mladozenje', 3)
ON CONFLICT (slug) DO NOTHING;
