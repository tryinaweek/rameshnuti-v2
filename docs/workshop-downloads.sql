-- Link a workshop download to the person who unlocked it.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Until this runs, downloads are still logged, just without an address:
-- logDownload() retries the insert without the column if it is missing.

alter table public.workshop_downloads
  add column if not exists email text;

-- Answers "everything this person has ever taken".
create index if not exists workshop_downloads_email_idx
  on public.workshop_downloads (lower(email));

-- The anon key may insert but never read, same trust model as THE LIST.
-- The existing insert policy already covers the new column; nothing to change.
