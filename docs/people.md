# People

`/admin` → **People**. Everyone who has ever given an address to any product in
this Supabase project, merged into one row per person.

## Which application does a person belong to?

Partly answerable, and the honest answer differs per product.

This database is shared by several products and none of them writes to a common
users table. So the **table an address appears in is the strongest signal**, and
`src/lib/people.ts` maps each table to a product label.

| Signal | Quality |
|---|---|
| The table itself | Reliable. `tip_subscribers` is Daily Tips, `profiles` is Play With Prompts. |
| `people.source` | Reliable for rameshnuti.com: `workshop-<slug>`, `build-<slug>`, `tool-<name>`. |
| `ai_prompt_users.signup_source` | Useless today. Every row says `direct`. |
| `profiles.user_type` | A persona (student/professional), not a product. |

The one real gap: `people.source` is `account` for everyone created by the
prompt-game app, so those are identifiable as Play With Prompts users but
nothing records what brought them there.

## Where did they come from?

Only `build_signups` records UTM parameters and referrer. Every other signup
path throws that away, so the "Came from" column reads "not captured" for
almost everyone. To change that, the other forms have to start capturing it at
submit time the way the Build Pack form already does.

## Merging

Rows are merged on lowercased email. One person who signed up to three products
is one row with three application tags, and the row expands to show each
underlying record with its table, source and date. `firstSeen` is the earliest
date across all of them.

## Files

```
src/lib/people.ts                 reads every signup table, merges by email
src/app/api/admin/people/         admin-gated JSON
src/app/admin/PeopleManager.tsx   the dashboard
```

Reads use `SUPABASE_SERVICE_ROLE_KEY` and happen only on the server. The
dashboard component declares its own types rather than importing the module, so
the key can never reach a browser bundle.
