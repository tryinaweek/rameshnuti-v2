# Workshops

Each workshop is a slug, a title, and a folder of files in Vercel Blob. Visitors
unlock a workshop with their email, then download from
`/workshops/<slug>/resources`.

## Who downloaded what

Two cookies are set at the gate, both expiring together after 24 hours:

| Cookie | Purpose |
|---|---|
| `unlocked_<slug>` | lets the resources page render |
| `workshop_email` | identifies the downloader |

`/api/download` reads `workshop_email` and writes it onto the
`workshop_downloads` row, so the admin panel can show a table of who took which
file and when, plus a CSV export.

This is attribution, not access control. The endpoint has never been gated and
the underlying blob URL is public, so a shared or bookmarked link still works
and is logged as a direct link with no address. The cookie is client-set and
therefore forgeable, exactly like `unlocked_<slug>` already was; the value is
normalized server side before it reaches the database.

Run `docs/workshop-downloads.sql` once to add the column. Before it runs,
downloads are still recorded, just anonymously.

## Files

```
src/lib/workshop-cookies.ts          cookie names + email normalization (no imports)
src/lib/workshops.ts                 blob reads/writes, download log, admin stats
src/components/NewsletterForm.tsx    the gate; sets both cookies
src/app/api/download/                tracked download, reads the email cookie
src/app/api/admin/workshops/         admin list, counts, download events
src/app/admin/page.tsx               the dashboard
```
