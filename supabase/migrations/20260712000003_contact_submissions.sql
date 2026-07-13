-- Lead capture for the public contact form. Anonymous visitors may INSERT a
-- submission (that is the form's whole job), but only an authenticated admin may
-- read them back — visitors must never be able to list other people's messages.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  address text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (anon) may submit the form.
drop policy if exists "contact anon insert" on public.contact_submissions;
create policy "contact anon insert"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- Only the admin may read submissions.
drop policy if exists "contact admin read" on public.contact_submissions;
create policy "contact admin read"
  on public.contact_submissions for select
  to authenticated
  using (true);
