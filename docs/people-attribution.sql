-- How someone first arrived at the site, recorded on book waitlist signups
-- (src/lib/attribution.ts). Applied in Supabase on 2026-11-01.
-- All nullable: rows from before this, and from other products sharing the
-- people table, simply have no value.
alter table public.people
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists referrer     text,
  add column if not exists landing_page text;
