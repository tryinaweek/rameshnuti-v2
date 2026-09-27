# Email capture

One rule: **every address captured on this site ends up in Substack.**

| Layer | System | Role |
|---|---|---|
| Mailing list | Substack, `startupvalue.substack.com` | The only thing that ever sends to subscribers. Every Saturday. |
| Memory | Supabase `public.people` (THE LIST) | Who signed up, for what, when. Never sends email. |
| Automations | GoHighLevel | Its own workflows. Anything it captures is posted to `/api/subscribe`. |

The newsletter is described once, in `src/lib/newsletter.ts`. Every form and
every mention reads from it, so the site can't drift back into promising five
different newsletters.

## The two forms

| Form | Where | Endpoint |
|---|---|---|
| `NewsletterForm` | Homepage, articles, about, lab, tools, workshop gates | `POST /api/subscribe` |
| `FirstEditionForm` | `/vibe-coding-os` | `POST /api/waitlist` |

Both endpoints do the same two steps, in this order:

1. **Record it on THE LIST.** The address survives whatever happens next.
   The waitlist also assigns position and the first 50 advance copies here,
   and nothing after this step can change that.
2. **Hand it to Substack** with `syncToSubstack()` (`src/lib/substack.ts`).
   On success, `substack_synced` / `substack_synced_at` are stamped on the row.

If Substack doesn't confirm, the visitor sees a one-click **Confirm on
Substack** link to Substack's own signup page, prefilled. No popup, no silent
failure.

A workshop gate is just `NewsletterForm` with `redirectTo`: it sets the unlock
and attribution cookies, subscribes the address, then offers the files.

## How it reaches Substack

Substack has no supported API for adding a subscriber. What it supports is its
signup embed, its `/subscribe` page, and CSV import. So:

- **Automatic:** the server posts to `{publication}/api/v1/free`, the request
  Substack's own embed makes. Undocumented, credential-free, idempotent.
- **One click, supported:** the "Confirm on Substack" link when the automatic
  step didn't land.
- **Catch-up, supported:** Admin → People → **Download for Substack** gives
  every unsynced address as Substack's import CSV. Import it at *Settings →
  Subscribers → Import*, then click **I imported them**.

Because step 1 always runs first, the catch-up can recover anyone. Nobody who
typed an address into this site is ever lost.

## GoHighLevel

Nothing in this repository talks to GoHighLevel. The bridge is one Webhook
action per GHL workflow that captures a contact:

1. GoHighLevel → **Automation** → open the workflow for the form.
2. **+** after the trigger → **Webhook**.
3. Method **POST**, URL `https://rameshnuti.com/api/subscribe`.
4. Custom Data: `email` = `{{contact.email}}`, `name` = `{{contact.first_name}}`,
   `source` = `ghl:<form-name>`.
5. Save, then **Publish** the workflow.

## Setup

Run `docs/substack-sync.sql` once in Supabase. Until then, signups still reach
Substack; only the audit stamp and the catch-up export are unavailable.

| Variable | Needed for |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | The audit stamp, the waitlist, and the catch-up export |
| `ADMIN_PASSWORD` | The admin panel |
| `SUBSTACK_PUBLICATION_URL` | Optional. Defaults to `https://startupvalue.substack.com` |

## Files

```
src/lib/newsletter.ts                  name, cadence, promise, URL — the one description
src/lib/substack.ts                    subscribeToSubstack, markSubstackSynced, syncToSubstack
src/app/api/subscribe/route.ts         every NewsletterForm, and GoHighLevel webhooks
src/app/api/waitlist/route.ts          the book waitlist, then Substack
src/app/api/admin/substack/route.ts    catch-up CSV and mark-synced
src/components/NewsletterForm.tsx      the one signup form
src/app/admin/PeopleManager.tsx        the catch-up buttons
docs/substack-sync.sql                 the two audit columns
```
