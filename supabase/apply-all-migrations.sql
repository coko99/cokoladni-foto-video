-- Čokoladni galerija — Supabase šema
-- Pokreni SAMO JEDNOM u Supabase SQL Editoru (prvi put)
-- Ako već imaš tabele, koristi migration-v2.sql umesto ovoga

-- ─── Tabele ───────────────────────────────────────────────────────────────

create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  username text unique,
  access_code text not null,
  title text not null,
  client_name text not null,
  client_email text not null,
  hosts_info text,
  event_type text,
  event_date date,
  pin_hash text,
  pin_plain text,
  max_selections int,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.selections (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  client_name text not null,
  client_email text not null,
  client_phone text,
  sender_relation text not null default 'Drugo',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.selection_images (
  id uuid primary key default gen_random_uuid(),
  selection_id uuid not null references public.selections(id) on delete cascade,
  image_id uuid not null references public.gallery_images(id) on delete cascade
);

alter table public.galleries
  add column if not exists hero_image_id uuid references public.gallery_images(id) on delete set null;

-- ─── Indeksi ────────────────────────────────────────────────────────────────

create index if not exists idx_galleries_slug on public.galleries(slug);
create index if not exists idx_gallery_images_gallery on public.gallery_images(gallery_id);
create index if not exists idx_selections_gallery on public.selections(gallery_id);

-- ─── RLS ──────────────────────────────────────────────────────────────────

alter table public.galleries enable row level security;
alter table public.gallery_images enable row level security;
alter table public.selections enable row level security;
alter table public.selection_images enable row level security;

-- Admin (autentifikovani korisnik) — pun pristup
drop policy if exists "admin_all_galleries" on public.galleries;
create policy "admin_all_galleries" on public.galleries
  for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_images" on public.gallery_images;
create policy "admin_all_images" on public.gallery_images
  for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_selections" on public.selections;
create policy "admin_all_selections" on public.selections
  for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_selection_images" on public.selection_images;
create policy "admin_all_selection_images" on public.selection_images
  for all to authenticated using (true) with check (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────
-- Bucket se automatski kreira pri prvom uploadu.
-- Ili ručno: Storage → New bucket → ime "gallery-images" → Public: ON


-- ─── next file ───

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
  ('Samo mlada', 'samo-mlada', 1),
  ('Samo mladoženje', 'samo-mladozenje', 2),
  ('Mlada sa devojkama', 'mlada-sa-devojkama', 3),
  ('Mladoženje sa momcima', 'mladozenje-sa-momcima', 4)
ON CONFLICT (slug) DO NOTHING;
