-- Veličina fajla pri uploadu (tačnije merenje prostora)
alter table public.gallery_images
  add column if not exists file_size_bytes bigint;

-- SQL funkcija — isti podatak kao Supabase Storage dashboard
create or replace function public.gallery_storage_used_bytes()
returns bigint
language sql
stable
security definer
set search_path = public, storage
as $$
  select coalesce(sum((metadata->>'size')::bigint), 0)::bigint
  from storage.objects
  where bucket_id = 'gallery-images';
$$;

grant execute on function public.gallery_storage_used_bytes() to service_role;
