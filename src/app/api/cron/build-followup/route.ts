import { NextRequest, NextResponse } from 'next/server';

import { followUpEmail, sendEmail } from '@/lib/build-emails';
import { serviceHeaders } from '@/lib/build-signups';
import { SUPABASE_URL } from '@/lib/workshops';

/**
 * Email 2 of the sequence — "Did you build anything yet?" — sent two days
 * after someone downloads a Build Pack.
 *
 * Runs daily from the Vercel cron in vercel.json. Each row is stamped with
 * followup_sent_at the moment it is sent, so re-running the job never mails
 * the same person twice.
 *
 * Auth: Vercel signs cron requests with CRON_SECRET as a bearer token. The
 * same secret works for a manual curl when testing.
 */

export const dynamic = 'force-dynamic';

const DAYS = 2;
const BATCH = 100;

interface SignupRow {
  id: string;
  first_name: string | null;
  email: string;
  build_slug: string;
  build_title: string | null;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not set' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const headers = serviceHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  const query =
    `${SUPABASE_URL}/rest/v1/build_signups` +
    `?select=id,first_name,email,build_slug,build_title` +
    `&followup_sent_at=is.null&created_at=lt.${cutoff}&limit=${BATCH}`;

  const res = await fetch(query, { headers, cache: 'no-store' });
  if (!res.ok) {
    return NextResponse.json({ error: `Read failed (${res.status})` }, { status: 502 });
  }
  const rows = (await res.json()) as SignupRow[];

  let sent = 0;
  let failed = 0;
  const origin = req.nextUrl.origin;

  for (const row of rows) {
    const mail = followUpEmail({
      firstName: row.first_name ?? '',
      buildTitle: row.build_title ?? 'the build',
      buildSlug: row.build_slug,
      downloadUrl: `${origin}/build/${row.build_slug}`,
    });
    const ok = await sendEmail({ to: row.email, ...mail });
    if (!ok) {
      failed += 1;
      continue;
    }
    // Stamp only after a confirmed send, so a mail outage retries tomorrow.
    await fetch(`${SUPABASE_URL}/rest/v1/build_signups?id=eq.${encodeURIComponent(row.id)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ followup_sent_at: new Date().toISOString() }),
    });
    sent += 1;
  }

  return NextResponse.json({ ok: true, due: rows.length, sent, failed });
}
