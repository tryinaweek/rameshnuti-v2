import { isTodo, todoText } from '@/lib/build-types';

/**
 * A build page never quietly passes an unfinished section off as finished.
 * Anything still written as `TODO: ...` renders in amber with a plain label,
 * so a half-written teardown reads as half-written to Ramesh and to readers.
 */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-600">
        To fill in
      </span>
      <span className="text-sm leading-relaxed">{children}</span>
    </span>
  );
}

/** Renders one field: normal copy, or a Todo marker when it's still a TODO. */
export function Field({
  value,
  className = 'text-slate-600 text-sm leading-relaxed',
  fallback = 'Not written yet.',
}: {
  value: string;
  className?: string;
  fallback?: string;
}) {
  const text = value.trim();
  if (!text) return <Todo>{fallback}</Todo>;
  if (isTodo(text)) return <Todo>{todoText(text)}</Todo>;
  return <p className={className}>{text}</p>;
}

/** Multi-paragraph copy, split on blank lines. */
export function Prose({ value }: { value: string }) {
  const text = value.trim();
  if (!text) return <Todo>Not written yet.</Todo>;
  if (isTodo(text)) return <Todo>{todoText(text)}</Todo>;
  return (
    <div className="space-y-4">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i} className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  );
}

/**
 * Inline text that keeps the amber treatment inside a table cell, a step, or a
 * tag. The "To fill in" label is uppercase mono; the note beside it stays in
 * normal case, because a whole sentence set in caps is hard to read.
 */
export function Inline({ value, className = '' }: { value: string; className?: string }) {
  const text = value.trim();
  if (!text || isTodo(text)) {
    const note = text ? todoText(text) : '';
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-2 text-amber-900">
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-600">
          To fill in
        </span>
        {note && <span className="text-sm leading-relaxed">{note}</span>}
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}

/** A section with nothing in it at all. */
export function EmptySection({ hint }: { hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-5 py-4">
      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-600">
        To fill in
      </p>
      <p className="mt-1 text-sm leading-relaxed text-amber-900">{hint}</p>
    </div>
  );
}
