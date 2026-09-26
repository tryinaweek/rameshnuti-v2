# Email capture

One rule: **every address captured anywhere ends up in Substack.**

| Layer | System | Role |
|---|---|---|
| Mailing list | Substack, `startupvalue.substack.com` ("Ship This Week with Ramesh Nuti") | The only thing that ever sends a broadcast. Newsletter, book launch, all of it. |
| Memory | Supabase `public.people` (THE LIST) | Who signed up, for what, when, from where. Never sends email. Never a second list. |
| Automations | GoHighLevel | Its own workflows, untouched. Every contact it captures must also be posted to this site so it reaches Substack. |

## The one endpoint

`POST /api/subscribe` with `{ "email": "...", "name": "optional", "source": "where-it-came-from" }`.

It does two things, in this order:

1. Inserts into `people` with the anon key. A 409 means the address was already
   there, which is fine.
2. Calls `syncToSubstack()` (`src/lib/substack.ts`). If Substack accepts the
   address, `substack_synced` / `substack_synced_at` are stamped on the row.

Response: `{ ok, alreadySubscribed, substack: "synced" | "pending", audited }`.
The visitor's outcome never depends on step 2.

Every form on the site already posts here (`NewsletterForm`), so the workshop
download gate, the article sidebar, the tools pages, and the courses waitlist
all flow through it. The book waitlist is the one exception in shape, not in
rule: `/api/waitlist` runs its own Supabase insert first (it decides waitlist
position and the first 50 advance copies, and that ordering must never
change), then calls the same `syncToSubstack()` with
`source: "website:book-waitlist"`.

## Which Substack method, and why

Substack has no supported API for adding a subscriber. Its Developer API
(2026) only looks up creator profiles. What Substack does support:

1. The official signup **embed** (`/embed` iframe)
2. The **/subscribe** page, with the address prefilled
3. **CSV import** from the publisher dashboard

None of those is callable from a server, so the site uses all three in layers:

- **Client side, supported:** `SubstackEmbed` (the official iframe) on the
  homepage and at the end of every article. `NewsletterForm` still opens
  `/subscribe?email=` in a new tab after posting to `/api/subscribe`.
- **Server side, best effort:** `subscribeToSubstack()` posts to
  `{publication}/api/v1/free?nojs=true`, the request the official embed itself
  makes when its button is pressed. Undocumented, credential-free, idempotent
  for an existing address. Any failure (timeout, captcha, 5xx) is logged and
  the row stays `substack_synced = false`.
- **Safety net, supported:** `GET /api/admin/substack` (admin password header)
  returns every unsynced row as the exact CSV Substack's import accepts. Import
  it at *Settings → Subscribers → Import*, then `POST /api/admin/substack`
  with `{ "emails": [...] }` to mark them synced. If the undocumented request
  ever stops working, nothing is lost and the fallback is fully supported.

Double opt-in is Substack's decision. This site sends no email of any kind;
whatever confirmation flow the publication has enabled runs exactly as it
would for an embed signup.

The one capture that does **not** touch Supabase is the official embed
itself: the iframe never tells this site the address. That is by design.
Supabase is memory, not the list.

## GoHighLevel

Nothing in this repository talks to GoHighLevel, and no page on rameshnuti.com
embeds a GHL form. The workshop download gate is `NewsletterForm`, which
already goes through `/api/subscribe`. So the bridge for GHL is a Webhook
action inside each GHL workflow that captures a contact, pointing at this
endpoint.

For each GHL form or funnel that creates a contact:

1. GoHighLevel → **Automation** → open the workflow that runs when the form is
   submitted (or create one with the trigger *Form Submitted* / *Survey
   Submitted* / *Order Form Submission* for that form).
2. Click **+** after the trigger → **Webhook**.
3. Method: **POST**. URL: `https://rameshnuti.com/api/subscribe`.
4. Under *Custom Data* add three fields:
   - `email` → `{{contact.email}}`
   - `name` → `{{contact.first_name}}`
   - `source` → `ghl:<form-name>` (type it literally, e.g. `ghl:workshop-download`)
5. Save the action, then **Publish** the workflow (top-right toggle).
6. Test: submit the form once with your own address. In Supabase, the `people`
   row appears with `source = ghl:<form-name>`; in Substack, the address shows
   under *Subscribers* within a minute.

Existing GHL steps are untouched; this only adds one action per workflow.

## Setup

Run `docs/substack-sync.sql` once in the Supabase SQL editor. Until it runs,
signups still work and still reach Substack; only the audit stamp is skipped
(the PATCH fails quietly and `audited: false` comes back).

| Variable | Needed for |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Stamping the audit columns, and the admin export |
| `SUBSTACK_PUBLICATION_URL` | Optional. Defaults to `https://startupvalue.substack.com` |
| `SUPABASE_URL` | Optional. Defaults to the project; overridable for local testing |

## Files

```
src/lib/substack.ts                    subscribeToSubstack, markSubstackSynced, syncToSubstack
src/app/api/subscribe/route.ts         the one endpoint (forms, GHL webhooks)
src/app/api/waitlist/route.ts          book waitlist: Supabase first, then Substack
src/app/api/admin/substack/route.ts    reconciliation CSV export + mark-synced
src/components/SubstackEmbed.tsx       the official embed, made responsive
src/components/NewsletterForm.tsx      unchanged; posts to /api/subscribe
docs/substack-sync.sql                 the two audit columns
```
