-- Pokreni u Supabase SQL Editor ako upload slika ne radi (403 / policy violation)
-- Dozvoljava prijavljenom adminu direktan upload u gallery-images bucket

drop policy if exists "admin_upload_gallery_images" on storage.objects;
create policy "admin_upload_gallery_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "admin_update_gallery_images" on storage.objects;
create policy "admin_update_gallery_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "admin_delete_gallery_images" on storage.objects;
create policy "admin_delete_gallery_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery-images');
