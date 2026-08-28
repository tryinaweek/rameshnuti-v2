# Build With Me

A public build notebook at `/build`. One build per Saturday: what I made, the
tools, the prompts, what broke, what it cost, and three ideas someone else can
build from the same concept.

Nothing here needs a code change to publish a new edition. Everything is
written in the admin panel.

---

## Publishing a new build

1. Go to `/admin`, enter the admin password, open the **Build With Me** tab.
2. Click **Turn preview on** (once per browser, lasts 24 hours).
3. Click **New build**. The build number is filled in for you.
4. Fill in the fields. Anything you leave as `TODO: something` renders on the
   page as a visible amber "To fill in" marker rather than pretending to be
   finished copy, so you can publish a partial teardown honestly and finish it
   later.
5. Upload the Build Pack file under section 13 and select it. That file is what
   the email form hands over.
6. Click **Preview** to open `/admin/preview/<slug>` — the real page, drafts
   included.
7. **Save and publish** when it's ready. It appears at `/build/<slug>` and in
   the library within a minute.
8. To put it on the homepage, tick **Feature on the homepage** and save. A
   build never reaches the homepage on its own.

### Build #001 — The Headshot App

Shipped as a seed record at `/build/headshot-app`, staged with real facts only:
the title, description, difficulty, build time, topics, product flow, three
ideas, checklist, and the live URL. Everything else — the stack, prompts,
costs, business model, what worked, what broke — is a `TODO:` marker waiting on
your input, because inventing those details would make the teardown worthless.

Open it in the admin panel and fill them in. Saving replaces the seed
permanently; `src/data/builds.ts` is only the starting point.

---

## Where the content lives

Vercel Blob, under the `build/` prefix:

```
build/_registry.json          card summaries for the library
build/<slug>/build.json       the full record for one build
build/<slug>/pack/<file>      that build's downloadable Build Pack
```

The registry is rebuilt from the records on every save, so the two can't drift.
`src/data/builds.ts` seeds Build #001 before anything has been saved and keeps
the section rendering if the blob store is unreachable.

---

## Where signups go

`POST /api/build-pack` writes to three places, in this order, and no later step
can break an earlier one:

1. **Supabase `build_signups`** — first name, email, signup date, source page,
   build slug and title, email tag, UTMs, referrer. The source of truth.
2. **Supabase `people`** — THE LIST, the same table every other address on the
   brand lands in, with `source = build-<slug>`.
3. **Kit** — optional. With `KIT_API_KEY` set, the subscriber is created and
   tagged `Build With Me` plus the per-build tag (`Build With Me - Headshot
   App`). Tags are looked up by name and created when missing, so there are no
   tag IDs to configure.

Nobody is subscribed twice: a unique index on `(email, build_slug)` means a
repeat request is ignored, and the same person can still collect a different
build's pack.

Spam protection: a hidden honeypot field, a minimum time-on-form check, and a
per-instance rate limit of 8 signups an hour per IP.

The teardown itself is never behind the form. If Supabase, Kit and Resend are
all down, the visitor still gets the download link back.

### Supabase tables

Run once in the SQL editor:

```sql
create table if not exists public.build_signups (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  email text not null,
  build_slug text not null,
  build_title text,
  email_tag text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  created_at timestamptz not null default now(),
  followup_sent_at timestamptz
);

-- One pack per person per build. This is what stops double subscribes.
create unique index if not exists build_signups_email_build_idx
  on public.build_signups (lower(email), build_slug);

create table if not exists public.build_downloads (
  id uuid primary key default gen_random_uuid(),
  build_slug text not null,
  filename text not null,
  created_at timestamptz not null default now()
);

-- Same trust model as THE LIST: the anon key may insert, never read.
alter table public.build_signups enable row level security;
alter table public.build_downloads enable row level security;

create policy "anon insert build signups" on public.build_signups
  for insert to anon with check (true);
create policy "anon insert build downloads" on public.build_downloads
  for insert to anon with check (true);
```

---

## The email sequence

| # | When | Subject | Sent by |
|---|------|---------|---------|
| 1 | Immediately | Your Build With Me pack is here | `/api/build-pack` |
| 2 | 2 days later | Did you build anything yet? | `/api/cron/build-followup`, daily |
| 3 | Next Saturday | Build #NNN: `<title>` | The weekly newsletter send |

Copy for all three lives in `src/lib/build-emails.ts`. Emails 1 and 2 go out
through Resend when `RESEND_API_KEY` is set; without it the section still works
and the download link on the success screen is what delivers the pack.

Email 2 is stamped `followup_sent_at` only after a confirmed send, so a mail
outage retries the next day and nobody gets it twice. Email 3 is editorial —
`nextEditionEmail()` builds it so the weekly send doesn't get rewritten from
scratch each week.

---

## Analytics

Fathom events, already wired:

- `build: live product / <slug>` — clicks through to the live product
- `build: copy prompt / <slug>` — prompt copied
- `build: pack signup / <slug>` — email captured
- `build: pack download / <slug>` — pack downloaded

Page views come from the existing Fathom pageview tracking. Download clicks
also log to `build_downloads`, and signups carry their UTMs, so the admin panel
can show **signups by traffic source** without leaving the site.

### UTM links

The admin panel has one-click copy buttons for the two sources that matter:

```
/build/<slug>?utm_source=whatsapp&utm_medium=community&utm_campaign=build-<n>
/build/<slug>?utm_source=startupgrind&utm_medium=event&utm_campaign=build-<n>
```

Use them everywhere. A link without UTMs shows up as `direct` and tells you
nothing.

---

## Environment variables

| Variable | Required | What breaks without it |
|----------|----------|------------------------|
| `ADMIN_PASSWORD` | yes | The admin panel and preview mode |
| `BLOB_READ_WRITE_TOKEN` | yes | Saving builds and uploading packs (reads fall back to the seed) |
| `SUPABASE_SERVICE_ROLE_KEY` | for stats | Signup counts in the admin panel, and email 2 |
| `RESEND_API_KEY` | optional | Emails 1 and 2. Downloads still work |
| `BUILD_EMAIL_FROM` | optional | Defaults to `Ramesh Nuti <ramesh@rameshnuti.com>` |
| `KIT_API_KEY` | optional | Kit sync and tagging. Supabase still records everything |
| `CRON_SECRET` | for email 2 | The follow-up cron returns 401 |

---

## Files

```
src/lib/build-types.ts               the Build record and pure helpers
src/lib/builds.ts                    blob reads and writes
src/lib/build-signups.ts             Supabase + Kit capture
src/lib/build-emails.ts              the three email templates and Resend
src/data/builds.ts                   the seeded Build #001
src/app/build/page.tsx               the library
src/app/build/[slug]/page.tsx        one teardown
src/app/admin/BuildsManager.tsx      the editor
src/app/admin/preview/               draft preview, cookie-gated
src/components/build/                the page components
src/app/api/build-pack/              signup
src/app/api/build-download/          tracked download
src/app/api/cron/build-followup/     email 2
src/app/api/admin/builds/            CRUD, pack upload, preview toggle
```
