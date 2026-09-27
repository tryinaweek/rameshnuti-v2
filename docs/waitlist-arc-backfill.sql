-- Vibe Coding OS: give the advance-copy tag to the first 50 waitlist members.
-- Run once in the Supabase SQL editor. Safe to re-run: it only tags people who
-- don't have the tag yet, and never more than the first 50.
--
-- Why this exists: before the advance-copy feature shipped, the book form
-- saved people as waitlist members (source = 'vibe-coding-os') without the
-- 'vcos-arc' tag. They are genuinely among the first on the waitlist, so they
-- are owed a copy. From now on the site decides by join position and tags at
-- join time; this only fixes the people who joined before that.
--
-- Order is by first_seen. For someone who was already on the list (say, a
-- newsletter subscriber) and joined the waitlist later, first_seen is when they
-- first gave an address, not when they joined the waitlist. Check the preview.

-- 1. PREVIEW: the first 50 waitlist members, and who is missing the tag.
select email, source, first_seen,
       coalesce(tags, '{}') @> array['vcos-arc'] as has_advance_copy
from public.people
where source = 'vibe-coding-os' or coalesce(tags, '{}') @> array['vibe-coding-os']
order by first_seen asc
limit 50;

-- 2. APPLY: tag the ones in that list who don't have it yet.
update public.people
set tags = array_append(coalesce(tags, '{}'), 'vcos-arc')
where id in (
  select id
  from public.people
  where source = 'vibe-coding-os' or coalesce(tags, '{}') @> array['vibe-coding-os']
  order by first_seen asc
  limit 50
)
and not (coalesce(tags, '{}') @> array['vcos-arc']);
