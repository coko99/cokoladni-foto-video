-- Migracija v2 — pokreni SAMO OVO ako već imaš tabele iz schema.sql
-- NE pokreći ponovo ceo schema.sql

-- 1. Nove kolone
alter table public.galleries
  add column if not exists username text,
  add column if not exists access_code text;

-- 2. Username indeks
create unique index if not exists idx_galleries_username
  on public.galleries(username) where username is not null;

-- 3. Dozvoli duplikate slika u izboru
alter table public.selection_images
  drop constraint if exists selection_images_selection_id_image_id_key;

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'selection_images'
      and c.contype = 'u'
  loop
    execute format(
      'alter table public.selection_images drop constraint if exists %I',
      r.conname
    );
  end loop;
end $$;

-- 4. Generiši kod za postojeće albume
update public.galleries
set access_code = upper(substr(md5(random()::text), 1, 6))
where access_code is null;

-- 5. Postavi username = slug za stare albume (ako nemaju username)
update public.galleries
set username = slug
where username is null and slug is not null;

-- 6. Čuvaj šifru za kopiranje poruke klijentu
alter table public.galleries
  add column if not exists pin_plain text;

-- 7. Ko je poslao izbor (majka, otac, sestra...)
alter table public.selections
  add column if not exists sender_relation text;

update public.selections
set sender_relation = coalesce(nullif(trim(client_name), ''), 'Drugo')
where sender_relation is null;

alter table public.selections
  alter column sender_relation set default 'Drugo';

alter table public.selections
  alter column sender_relation set not null;

-- 8. Hero podaci albuma
alter table public.galleries
  add column if not exists hosts_info text,
  add column if not exists event_type text,
  add column if not exists event_date date;

-- 9. Dozvoli upis izbora preko servera (service role)
drop policy if exists "service_all_selections" on public.selections;
create policy "service_all_selections" on public.selections
  for all to service_role using (true) with check (true);

drop policy if exists "service_all_selection_images" on public.selection_images;
create policy "service_all_selection_images" on public.selection_images
  for all to service_role using (true) with check (true);
