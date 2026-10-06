-- The Vibe Coder's OS: store the optional "What are you trying to build?"
-- answer on the sign-up record itself.
-- Run once in the Supabase SQL editor BEFORE deploying the new page. Safe to
-- re-run. It only adds one nullable column: no rows are changed or deleted, and
-- existing sign-ups simply have no answer.

alter table public.people
  add column if not exists build_idea text;

-- Check: should return one row.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'people' and column_name = 'build_idea';
