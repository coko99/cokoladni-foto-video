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
