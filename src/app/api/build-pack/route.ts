import { NextRequest, NextResponse } from 'next/server';

import { buildPackEmail, sendEmail } from '@/lib/build-emails';
import { recordSignup } from '@/lib/build-signups';
import { SECTION_EMAIL_TAG, findBuild, findPackFile } from '@/lib/builds';

/**
 * Build Pack signup. The teardown itself is never gated — this endpoint only
 * hands over the bonus download, so it stays deliberately forgiving: if the
 * database, the provider, or the mailer is down, the visitor still gets their
 * file and a success message.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Minimum time a human spends on the form before submitting. */
const MIN_FILL_MS = 2500;

/** Best-effort per-instance throttle. Serverless resets it often; that's fine. */
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Spam gate 1: hidden field no human ever sees, let alone fills in.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true, alreadySubscribed: false, downloadUrl: null });
  }

  // Spam gate 2: forms submitted faster than a person can type are bots.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0;
  if (elapsed > 0 && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ error: 'That was too quick. Try again.' }, { status: 429 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many signups from this connection. Try again later.' },
      { status: 429 },
    );
  }

  const firstName = str(body.firstName, 80);
  const email = str(body.email, 320).toLowerCase();
  const slug = str(body.buildSlug, 64);

  if (!firstName) {
    return NextResponse.json({ error: 'First name is required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
    return NextResponse.json({ error: 'Unknown build' }, { status: 400 });
  }

  const build = await findBuild(slug);
  if (!build) {
    return NextResponse.json({ error: 'Unknown build' }, { status: 404 });
  }

  const origin = req.nextUrl.origin;
  const pack = build.download_file ? await findPackFile(slug, build.download_file) : null;
  const downloadUrl = pack
    ? `${origin}/api/build-download?b=${encodeURIComponent(slug)}&f=${encodeURIComponent(pack.name)}`
    : null;

  const { isNew, stored } = await recordSignup({
    firstName,
    email,
    buildSlug: slug,
    buildTitle: build.title,
    emailTag: build.email_tag || `${SECTION_EMAIL_TAG} - ${build.title}`,
    sourcePage: str(body.sourcePage, 200) || `/build/${slug}`,
    utmSource: str(body.utmSource, 120),
    utmMedium: str(body.utmMedium, 120),
    utmCampaign: str(body.utmCampaign, 120),
    referrer: str(body.referrer, 300),
  });

  if (!stored) {
    // The visitor is fine — the address still reached THE LIST and the pack is
    // in the response. But the row with the name, tags and UTMs was lost, which
    // means build_signups is missing (see docs/build-with-me.md) or Supabase is
    // down. Loud in the logs, silent to the visitor.
    console.warn(`build-pack: build_signups write failed for ${slug}`);
  }

  // Email 1 of the sequence. Resend is optional, so the download link in the
  // response — not this send — is what actually delivers the pack.
  if (isNew) {
    const mail = buildPackEmail({
      firstName,
      buildTitle: build.title,
      buildSlug: slug,
      downloadUrl: downloadUrl ?? `${origin}/build/${slug}`,
    });
    void sendEmail({ to: email, ...mail });
  }

  return NextResponse.json({
    ok: true,
    alreadySubscribed: !isNew,
    downloadUrl,
    packName: pack?.name ?? null,
  });
}
