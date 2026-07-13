-- Row-level security for the single-row CMS content table.
-- Reads are public (the marketing site loads content anonymously); writes require
-- an authenticated Supabase Auth session (the admin account). Without this, the
-- anon/publishable key shipped in the client bundle could overwrite site content.

alter table public.site_content enable row level security;

-- Public read (anon + authenticated).
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Admin writes only. upsert needs both insert and update policies.
drop policy if exists "site_content admin insert" on public.site_content;
create policy "site_content admin insert"
  on public.site_content for insert
  to authenticated
  with check (true);

drop policy if exists "site_content admin update" on public.site_content;
create policy "site_content admin update"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);
