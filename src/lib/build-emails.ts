/**
 * The Build With Me follow-up sequence.
 *
 * Email 1 goes out immediately from /api/build-pack. Email 2 goes out two days
 * later from /api/cron/build-followup. Email 3 is the next Saturday edition,
 * which ships with the newsletter itself — its copy lives here so the same
 * voice and links are reused rather than rewritten each week.
 *
 * Sending is optional: with no RESEND_API_KEY set, the download still works
 * and the address is still captured. Nothing in the signup path depends on an
 * email actually going out.
 */

export const FROM_FALLBACK = 'Ramesh Nuti <ramesh@rameshnuti.com>';
const SITE = 'https://rameshnuti.com';

export interface BuildEmailContext {
  firstName: string;
  buildTitle: string;
  buildSlug: string;
  /** Absolute URL to the Build Pack, or the build page when no file exists. */
  downloadUrl: string;
}

function greeting(firstName: string): string {
  const name = firstName.trim();
  return name ? `Hi ${name},` : 'Hi,';
}

/** Wraps plain paragraphs in the same minimal shell for every send. */
function shell(paragraphs: string[], footerNote: string): string {
  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#0f172a;">${p}</p>`,
    )
    .join('');
  return [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;background:#ffffff;padding:24px;">',
    '<div style="max-width:520px;margin:0 auto;">',
    '<div style="height:3px;background:#2563eb;border-radius:2px;margin-bottom:24px;"></div>',
    body,
    `<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#64748b;">${footerNote}</p>`,
    '</div></div>',
  ].join('');
}

function textOf(paragraphs: string[], footerNote: string): string {
  const strip = (s: string) =>
    s
      .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, '$2 ($1)')
      .replace(/<[^>]+>/g, '');
  return [...paragraphs.map(strip), '', strip(footerNote)].join('\n\n');
}

const UNSUB = `You are getting this because you asked for a Build With Me pack at ${SITE}/build. Reply "stop" and I will take you off the list. <a href="${SITE}/privacy" style="color:#2563eb;">Privacy policy</a>.`;

export function buildPackEmail(ctx: BuildEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const paragraphs = [
    greeting(ctx.firstName),
    `Thank you for grabbing the pack for ${ctx.buildTitle}. Here it is:`,
    `<a href="${ctx.downloadUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:8px;">Download the Build Pack</a>`,
    'One suggestion. Do not read the whole thing. Pick one of the three ideas at the bottom of the teardown and build the smallest version of it this week. The smallest version is the one that produces a single useful output for a single person.',
    `The full teardown stays free and stays online: <a href="${SITE}/build/${ctx.buildSlug}" style="color:#2563eb;">${SITE}/build/${ctx.buildSlug}</a>`,
    'Ramesh',
  ];
  return {
    subject: 'Your Build With Me pack is here',
    html: shell(paragraphs, UNSUB),
    text: textOf(paragraphs, UNSUB),
  };
}

export function followUpEmail(ctx: BuildEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const paragraphs = [
    greeting(ctx.firstName),
    `A couple of days ago you downloaded the pack for ${ctx.buildTitle}.`,
    'One question, and it is a real one: what are you trying to build?',
    'Hit reply and tell me in a sentence. I read every response, and the answers decide which builds I do next.',
    'Ramesh',
  ];
  return {
    subject: 'Did you build anything yet?',
    html: shell(paragraphs, UNSUB),
    text: textOf(paragraphs, UNSUB),
  };
}

/**
 * Email 3, sent with the next Saturday edition. Kept here so the weekly send
 * can be assembled from the same template instead of written from scratch.
 */
export function nextEditionEmail(ctx: {
  firstName: string;
  buildNumber: number;
  buildTitle: string;
  buildSlug: string;
  oneLine: string;
}): { subject: string; html: string; text: string } {
  const paragraphs = [
    greeting(ctx.firstName),
    `This week's build is up: ${ctx.buildTitle}.`,
    ctx.oneLine,
    `The teardown covers the tools, the workflow, the prompts, what broke, what it cost, and three ideas you can build from the same concept: <a href="${SITE}/build/${ctx.buildSlug}" style="color:#2563eb;">Read Build #${String(ctx.buildNumber).padStart(3, '0')}</a>`,
    'Ramesh',
  ];
  return {
    subject: `Build #${String(ctx.buildNumber).padStart(3, '0')}: ${ctx.buildTitle}`,
    html: shell(paragraphs, UNSUB),
    text: textOf(paragraphs, UNSUB),
  };
}

/**
 * Sends through Resend when configured. Returns false (never throws) so a
 * mail outage can't fail a signup or a cron run.
 */
export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.BUILD_EMAIL_FROM || FROM_FALLBACK,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
