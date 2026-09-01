'use client';

import Link from 'next/link';
import { trackEvent } from 'fathom-client';
import { useEffect, useRef, useState } from 'react';

/**
 * The only email form in the section, and it is never in front of the
 * teardown. Everything above it stays free to read; this asks for an address
 * in exchange for the downloadable pack, and hands the file over immediately
 * on success rather than making the inbox the only route to it.
 *
 * Spam protection: a hidden honeypot field plus how long the form was open,
 * both checked server side in /api/build-pack.
 */

interface Attribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  sourcePage: string;
}

export function BuildPackForm({
  buildSlug,
  buildTitle,
  hasPack,
}: {
  buildSlug: string;
  buildTitle: string;
  hasPack: boolean;
}) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  // Stamped on mount, not during render, so the value stays stable.
  const openedAt = useRef(0);
  const attribution = useRef<Attribution>({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    referrer: '',
    sourcePage: `/build/${buildSlug}`,
  });

  // Read UTMs from the URL rather than useSearchParams, so the page around
  // this form stays statically rendered.
  useEffect(() => {
    openedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    attribution.current = {
      utmSource: params.get('utm_source') ?? '',
      utmMedium: params.get('utm_medium') ?? '',
      utmCampaign: params.get('utm_campaign') ?? '',
      referrer: document.referrer,
      sourcePage: window.location.pathname + window.location.search,
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/build-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          website,
          buildSlug,
          elapsedMs: Date.now() - openedAt.current,
          ...attribution.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        setStatus('idle');
        return;
      }
      setDownloadUrl(data.downloadUrl ?? null);
      setStatus('done');
      trackEvent(`build: pack signup / ${buildSlug}`);
    } catch {
      setError('Network error. Try again in a moment.');
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div className="animate-fade-up space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-accent/20 bg-teal-accent/10 text-sm font-bold text-teal-accent">
            ✓
          </span>
          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">You&apos;re in.</p>
            <p className="text-sm text-slate-600">Check your inbox for the Build Pack.</p>
          </div>
        </div>

        {downloadUrl ? (
          <a
            href={downloadUrl}
            onClick={() => trackEvent(`build: pack download / ${buildSlug}`)}
            className="btn-primary block w-full px-6 py-3 text-center text-sm"
          >
            Download it now &rarr;
          </a>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            The pack for {buildTitle} is still being put together. It lands in your inbox the
            moment it is ready.
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-slate-400">
          No spam. Just new builds, prompts, and practical AI experiments. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website-url">Leave this field empty</label>
        <input
          id="website-url"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="pack-first-name"
            className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            First name
          </label>
          <input
            id="pack-first-name"
            type="text"
            autoComplete="given-name"
            required
            maxLength={80}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="premium-input w-full px-4 py-3 text-sm"
            placeholder="Ramesh"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="pack-email"
            className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            Email address
          </label>
          <input
            id="pack-email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="premium-input w-full px-4 py-3 text-sm"
            placeholder="you@company.com"
          />
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full px-6 py-3.5 text-sm disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send me the Build Pack'}
      </button>

      <p className="text-[11px] leading-relaxed text-slate-500">
        No spam. Just new builds, prompts, and practical AI experiments. Unsubscribe anytime.{' '}
        <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">
          Privacy policy
        </Link>
        .
      </p>
      {!hasPack && (
        <p className="text-[11px] leading-relaxed text-slate-400">
          The teardown above stays free either way. This is only for the downloadable extras.
        </p>
      )}
    </form>
  );
}
