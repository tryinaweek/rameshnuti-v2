'use client';

import { trackEvent } from 'fathom-client';
import { useState } from 'react';

/**
 * Prompts are the part people actually take away, so copying one has to be a
 * single tap on a phone. The body stays selectable text (not an image) and
 * scrolls inside its own box rather than stretching the page.
 */
export function CopyablePrompt({
  label,
  body,
  note,
  buildSlug,
}: {
  label: string;
  body: string;
  note?: string;
  buildSlug: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      trackEvent(`build: copy prompt / ${buildSlug}`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (older browser, insecure context) — the text is
      // still selectable, so there is nothing to recover from.
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <p className="min-w-0 truncate font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <button
          onClick={copy}
          className="shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors hover:border-teal-accent hover:text-teal-accent"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-96 overflow-auto px-4 py-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words text-slate-700">
        {body}
      </pre>
      {note && (
        <p className="border-t border-slate-100 px-4 py-2.5 text-xs leading-relaxed text-slate-500">
          {note}
        </p>
      )}
    </div>
  );
}
