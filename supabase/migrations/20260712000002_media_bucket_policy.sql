-- Storage policies for the public media bucket (default name: `media`).
-- Objects stay publicly readable (served as https:// public URLs on the site),
-- but only an authenticated admin may upload, overwrite, or delete. Adjust the
-- bucket_id below if VITE_SUPABASE_MEDIA_BUCKET is set to a different name.

-- Public read of objects in the media bucket.
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Admin-only upload.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- Admin-only overwrite (upsert:true reuses the same object path).
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

-- Admin-only delete.
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
