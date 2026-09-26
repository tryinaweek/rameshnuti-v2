-- Substack sync audit trail on THE LIST.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Supabase is the memory layer; Substack is the only mailing list. These two
-- columns record whether a given address has been handed to Substack yet.
-- They are an audit trail, nothing more: no code reads them to decide whether
-- to send email, because nothing on this site sends email.

alter table public.people
  add column if not exists substack_synced boolean not null default false;

alter table public.people
  add column if not exists substack_synced_at timestamptz;

-- The reconciliation export (/api/admin/substack-export) selects on this.
create index if not exists people_substack_synced_idx
  on public.people (substack_synced)
  where substack_synced = false;

-- The anon key may still only insert. Flipping these flags uses the service
-- role key on the server (src/lib/substack.ts), so no policy change is needed.
