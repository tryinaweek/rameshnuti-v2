'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  DIFFICULTY_OPTIONS,
  SECTION_EMAIL_TAG,
  TOOL_CATEGORIES,
  buildNumberLabel,
  type Build,
  type BuildPackFile,
  type BuildSummary,
} from '@/lib/build-types';

/**
 * Build With Me editor. Every field a build page renders is here, so shipping
 * next Saturday's edition is filling in a form, not touching the codebase.
 *
 * The flow the section was designed around: create → fill in → preview at the
 * real URL → publish → (optionally) feature on the homepage.
 */

interface AdminBuildRow extends BuildSummary {
  signups: number | null;
}

const BLANK: Build = {
  build_number: 0,
  title: '',
  slug: '',
  short_description: '',
  hero_image: '',
  live_product_url: '',
  publish_date: '',
  difficulty: 'Beginner-friendly',
  estimated_build_time: '',
  topics: [],
  why_i_built_it: '',
  product_flow: [],
  tools: [],
  workflow: [],
  prompts: [],
  what_worked: [],
  what_failed: [],
  costs: [
    { item: 'AI / API', amount: '', note: '' },
    { item: 'Hosting', amount: '', note: '' },
    { item: 'Database', amount: '', note: '' },
    { item: 'Payment fees', amount: '', note: '' },
    { item: 'Other services', amount: '', note: '' },
  ],
  business_model: {
    how_it_makes_money: '',
    pricing: '',
    why_this_pricing: '',
    what_id_test_next: '',
  },
  three_build_ideas: [
    { name: '', description: '', who_its_for: '', mvp: '' },
    { name: '', description: '', who_its_for: '', mvp: '' },
    { name: '', description: '', who_its_for: '', mvp: '' },
  ],
  build_checklist: [
    'Define the smallest useful output',
    'Choose one input',
    'Generate one output',
    'Show the user value quickly',
    'Add payment only after the experience works',
    'Ship the ugly version',
    'Get 5 people to test it',
  ],
  seo_title: '',
  seo_description: '',
  og_image: '',
  download_file: '',
  email_tag: '',
  status: 'draft',
  featured_on_home: false,
  updated_at: '',
};

const INPUT =
  'premium-input w-full px-3.5 py-2.5 text-sm focus:border-teal-accent transition-colors';
const LABEL =
  'block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5';

function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT} resize-y leading-relaxed`}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

/** One line per item — the fastest way to edit an ordered list of strings. */
function Lines({
  label,
  value,
  onChange,
  rows = 5,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Area
      label={label}
      rows={rows}
      value={value.join('\n')}
      onChange={(v) => onChange(v.split('\n').map((l) => l.trim()).filter(Boolean))}
      hint={hint ?? 'One per line.'}
    />
  );
}

function Repeater<T>({
  label,
  items,
  onChange,
  blank,
  render,
  addLabel,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
}) {
  const update = (index: number, patch: Partial<T>) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <div className="space-y-3">{render(item, (patch) => update(i, patch))}</div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, blank()])}
          className="btn-secondary w-full px-4 py-2.5 text-xs"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}

export function BuildsManager({ password }: { password: string }) {
  const [rows, setRows] = useState<AdminBuildRow[]>([]);
  const [statsAvailable, setStatsAvailable] = useState(true);
  const [bySource, setBySource] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<Build | null>(null);
  const [packFiles, setPackFiles] = useState<BuildPackFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewOn, setPreviewOn] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState('');

  const headers = { 'x-admin-password': password };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/builds', { headers: { 'x-admin-password': password } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed (${res.status})`);
        return;
      }
      setRows(data.builds);
      setStatsAvailable(data.statsAvailable);
      setBySource(data.signupsBySource ?? {});
    } catch {
      setError('Network error — could not reach the builds API');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openBuild = async (slug: string) => {
    setError('');
    setMessage('');
    const res = await fetch(`/api/admin/builds?slug=${encodeURIComponent(slug)}`, { headers });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not load that build');
      return;
    }
    setDraft(data.build);
    setPackFiles(data.packFiles ?? []);
  };

  const newBuild = () => {
    const next = rows.reduce((max, r) => Math.max(max, r.build_number), 0) + 1;
    setDraft({
      ...BLANK,
      build_number: next,
      publish_date: new Date().toISOString().slice(0, 10),
    });
    setPackFiles([]);
    setError('');
    setMessage('');
  };

  const patch = (p: Partial<Build>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const save = async (overrides: Partial<Build> = {}) => {
    if (!draft) return;
    setSaving(true);
    setError('');
    setMessage('');
    const payload = { ...draft, ...overrides };
    const res = await fetch('/api/admin/builds', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setDraft(data.build);
      setMessage(
        `Saved Build ${buildNumberLabel(data.build.build_number)} — ${data.build.status}`,
      );
      await refresh();
    } else {
      setError(data.error || 'Save failed');
    }
    setSaving(false);
  };

  const remove = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}" and its Build Pack? This cannot be undone.`)) return;
    const res = await fetch('/api/admin/builds', {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setDraft(null);
      setMessage(`Deleted ${title}`);
      await refresh();
    } else {
      setError('Delete failed');
    }
  };

  const uploadPack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft?.slug) return;
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('slug', draft.slug);
    const res = await fetch('/api/admin/builds/pack', { method: 'POST', headers, body: form });
    const data = await res.json();
    if (res.ok) {
      setPackFiles(data.packFiles);
      patch({ download_file: data.file.name });
      setMessage(`Uploaded ${data.file.name}. Save to attach it to the build.`);
    } else {
      setError(data.error || 'Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  const deletePack = async (file: BuildPackFile) => {
    if (!draft || !confirm(`Delete ${file.name}?`)) return;
    const res = await fetch('/api/admin/builds/pack', {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: draft.slug, url: file.url }),
    });
    const data = await res.json();
    if (res.ok) {
      setPackFiles(data.packFiles);
      if (draft.download_file === file.name) patch({ download_file: '' });
    } else {
      setError('Could not delete that file');
    }
  };

  const togglePreview = async (on: boolean) => {
    const res = await fetch('/api/admin/builds/preview', {
      method: on ? 'POST' : 'DELETE',
      headers,
    });
    if (res.ok) {
      setPreviewOn(on);
      setMessage(on ? 'Preview on for this browser (24 hours).' : 'Preview off.');
    } else {
      setError('Could not change preview mode');
    }
  };

  const copy = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const origin = typeof window === 'undefined' ? 'https://rameshnuti.com' : window.location.origin;

  // ---------------------------------------------------------------- list view

  if (!draft) {
    const sources = Object.entries(bySource).sort((a, b) => b[1] - a[1]);
    return (
      <div className="space-y-6 text-left">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            {message}
          </div>
        )}
        {!statsAvailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
            Signup counts are off. Add <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
            to the Vercel project and redeploy. See{' '}
            <code className="font-mono">docs/build-with-me.md</code> for the tables this section
            expects.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={newBuild} className="btn-primary px-5 py-2.5 text-sm">
            New build
          </button>
          <button
            onClick={() => togglePreview(!previewOn)}
            className="btn-secondary px-4 py-2.5 text-xs"
          >
            {previewOn ? 'Turn preview off' : 'Turn preview on'}
          </button>
          <a
            href="/admin/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-4 py-2.5 text-xs"
          >
            Open preview &rarr;
          </a>
          <a
            href="/build"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-2.5 text-xs font-bold text-teal-accent hover:underline"
          >
            View live /build
          </a>
        </div>

        <div className="grid gap-4">
          {rows.map((row) => (
            <div
              key={row.slug}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold tracking-widest text-teal-accent">
                      BUILD {buildNumberLabel(row.build_number)}
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                        row.status === 'published'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.featured_on_home && (
                      <span className="rounded border border-slate-900 bg-slate-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                        On homepage
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-base font-bold tracking-tight text-slate-900">
                    {row.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">/build/{row.slug}</p>
                </div>
                <button
                  onClick={() => openBuild(row.slug)}
                  className="btn-primary shrink-0 px-4 py-2 text-xs"
                >
                  Edit &rarr;
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-slate-600">
                <span>
                  <strong className="text-slate-900">{row.signups ?? '—'}</strong> signups
                </span>
                <button
                  onClick={() => copy(row.slug, `${origin}/build/${row.slug}`)}
                  className="cursor-pointer font-bold text-teal-accent hover:underline"
                >
                  {copied === row.slug ? 'Copied!' : 'Copy link'}
                </button>
                <button
                  onClick={() =>
                    copy(
                      `wa-${row.slug}`,
                      `${origin}/build/${row.slug}?utm_source=whatsapp&utm_medium=community&utm_campaign=build-${row.build_number}`,
                    )
                  }
                  className="cursor-pointer font-bold text-teal-accent hover:underline"
                >
                  {copied === `wa-${row.slug}` ? 'Copied!' : 'Copy WhatsApp link'}
                </button>
                <button
                  onClick={() =>
                    copy(
                      `sg-${row.slug}`,
                      `${origin}/build/${row.slug}?utm_source=startupgrind&utm_medium=event&utm_campaign=build-${row.build_number}`,
                    )
                  }
                  className="cursor-pointer font-bold text-teal-accent hover:underline"
                >
                  {copied === `sg-${row.slug}` ? 'Copied!' : 'Copy Startup Grind link'}
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && !loading && (
            <p className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No builds yet. Create the first one above.
            </p>
          )}
        </div>

        {sources.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-light p-5">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Signups by traffic source
            </h3>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {sources.map(([src, count]) => (
                <li key={src} className="flex justify-between font-mono text-xs text-slate-600">
                  <span>{src}</span>
                  <strong className="text-slate-900">{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------- editor view

  const previewHref = draft.slug ? `/admin/preview/${draft.slug}` : '/admin/preview';

  return (
    <div className="space-y-8 text-left">
      <div className="sticky top-16 z-10 -mx-1 flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white/95 px-1 py-3 backdrop-blur-sm">
        <button
          onClick={() => setDraft(null)}
          className="btn-secondary px-3.5 py-2 text-xs"
          type="button"
        >
          &larr; All builds
        </button>
        <button
          onClick={() => save()}
          disabled={saving}
          className="btn-primary px-5 py-2 text-xs disabled:opacity-40"
          type="button"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {draft.status === 'draft' ? (
          <button
            onClick={() => save({ status: 'published' })}
            disabled={saving}
            className="btn-secondary px-4 py-2 text-xs"
            type="button"
          >
            Save and publish
          </button>
        ) : (
          <button
            onClick={() => save({ status: 'draft' })}
            disabled={saving}
            className="btn-secondary px-4 py-2 text-xs"
            type="button"
          >
            Unpublish
          </button>
        )}
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-4 py-2 text-xs"
        >
          Preview &rarr;
        </a>
        {draft.updated_at && (
          <button
            onClick={() => remove(draft.slug, draft.title)}
            className="ml-auto cursor-pointer px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-600"
            type="button"
          >
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          {message}
        </div>
      )}
      {!previewOn && (
        <div className="rounded-xl border border-slate-200 bg-slate-light px-4 py-3 text-xs text-slate-600">
          Preview is off in this browser, so drafts will not render.{' '}
          <button
            onClick={() => togglePreview(true)}
            className="cursor-pointer font-bold text-teal-accent hover:underline"
            type="button"
          >
            Turn it on
          </button>
          .
        </div>
      )}

      {/* Publishing */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-light p-5">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          Publishing
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Build number</label>
            <input
              type="number"
              min={1}
              value={draft.build_number || ''}
              onChange={(e) => patch({ build_number: Number(e.target.value) })}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Publish date</label>
            <input
              type="date"
              value={draft.publish_date}
              onChange={(e) => patch({ publish_date: e.target.value })}
              className={INPUT}
            />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={draft.featured_on_home}
            onChange={(e) => patch({ featured_on_home: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-[#2563eb]"
          />
          <span>
            <strong className="font-semibold">Feature on the homepage.</strong> Off by default:
            a build only reaches the homepage once you flip this and publish it.
          </span>
        </label>
      </section>

      {/* 1. The build */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          1 · The build
        </h3>
        <Text label="Title" value={draft.title} onChange={(v) => patch({ title: v })} />
        <Text
          label="Slug"
          value={draft.slug}
          onChange={(v) => patch({ slug: v })}
          placeholder="headshot-app"
          hint={`Leave empty to generate it from the title. The URL becomes ${origin}/build/<slug>.`}
        />
        <Area
          label="One-line description"
          rows={3}
          value={draft.short_description}
          onChange={(v) => patch({ short_description: v })}
          hint="Shown on the library card and used as the fallback meta description."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Difficulty</label>
            <input
              list="build-difficulty"
              value={draft.difficulty}
              onChange={(e) => patch({ difficulty: e.target.value })}
              className={INPUT}
            />
            <datalist id="build-difficulty">
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          <Text
            label="Estimated build time"
            value={draft.estimated_build_time}
            onChange={(v) => patch({ estimated_build_time: v })}
            placeholder="Weekend project"
          />
        </div>
        <Lines
          label="Topics"
          rows={4}
          value={draft.topics}
          onChange={(v) => patch({ topics: v })}
        />
        <Text
          label="Hero image URL"
          value={draft.hero_image}
          onChange={(v) => patch({ hero_image: v })}
          hint="A screenshot of the real product. Upload it below and paste the URL here, or use any image URL."
        />
        <Text
          label="Live product URL"
          value={draft.live_product_url}
          onChange={(v) => patch({ live_product_url: v })}
        />
      </section>

      {/* 2-3 */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          2 · Why I built it
        </h3>
        <Area
          label="Why I built it"
          rows={7}
          value={draft.why_i_built_it}
          onChange={(v) => patch({ why_i_built_it: v })}
          hint="Blank lines start new paragraphs. Start a line with TODO: to leave a visible placeholder."
        />
        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          3 · The product idea
        </h3>
        <Lines
          label="Product flow steps"
          rows={5}
          value={draft.product_flow}
          onChange={(v) => patch({ product_flow: v })}
        />
      </section>

      {/* 4. Stack */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          4 · The stack
        </h3>
        <Repeater
          label="Tools"
          items={draft.tools}
          onChange={(tools) => patch({ tools })}
          blank={() => ({ category: 'Other tools', name: '', note: '' })}
          addLabel="Add a tool"
          render={(tool, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Category</label>
                  <select
                    value={tool.category}
                    onChange={(e) => update({ category: e.target.value })}
                    className={INPUT}
                  >
                    {TOOL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <Text label="Tool" value={tool.name} onChange={(v) => update({ name: v })} />
              </div>
              <Text
                label="Note (optional)"
                value={tool.note ?? ''}
                onChange={(v) => update({ note: v })}
              />
            </>
          )}
        />
      </section>

      {/* 5-6 */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          5 · How it works
        </h3>
        <Lines
          label="Workflow steps"
          rows={7}
          value={draft.workflow}
          onChange={(v) => patch({ workflow: v })}
        />
        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          6 · The prompts
        </h3>
        <Repeater
          label="Prompts"
          items={draft.prompts}
          onChange={(prompts) => patch({ prompts })}
          blank={() => ({ label: '', body: '', note: '' })}
          addLabel="Add a prompt"
          render={(prompt, update) => (
            <>
              <Text
                label="Label"
                value={prompt.label}
                onChange={(v) => update({ label: v })}
                placeholder="Headshot generation prompt"
              />
              <Area
                label="Prompt"
                rows={8}
                value={prompt.body}
                onChange={(v) => update({ body: v })}
                hint="Paste it exactly as it ran. Readers copy this with one tap."
              />
              <Text
                label="Note (optional)"
                value={prompt.note ?? ''}
                onChange={(v) => update({ note: v })}
              />
            </>
          )}
        />
      </section>

      {/* 7-9 */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          7 · What worked
        </h3>
        <Lines
          label="What worked"
          rows={5}
          value={draft.what_worked}
          onChange={(v) => patch({ what_worked: v })}
        />
        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          8 · What didn&apos;t work
        </h3>
        <Lines
          label="What didn't work"
          rows={5}
          value={draft.what_failed}
          onChange={(v) => patch({ what_failed: v })}
          hint="One per line. Failed approaches, limits, and what you would change. Do not leave this empty."
        />
        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          9 · Cost to build and run
        </h3>
        <Repeater
          label="Cost lines"
          items={draft.costs}
          onChange={(costs) => patch({ costs })}
          blank={() => ({ item: '', amount: '', note: '' })}
          addLabel="Add a cost line"
          render={(cost, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Text label="Line item" value={cost.item} onChange={(v) => update({ item: v })} />
                <Text
                  label="Cost"
                  value={cost.amount}
                  onChange={(v) => update({ amount: v })}
                  placeholder="~$12 / month"
                />
              </div>
              <Text
                label="Notes (optional)"
                value={cost.note ?? ''}
                onChange={(v) => update({ note: v })}
              />
            </>
          )}
        />
      </section>

      {/* 10-12 */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          10 · Product and business model
        </h3>
        <Area
          label="How it makes money"
          rows={3}
          value={draft.business_model.how_it_makes_money}
          onChange={(v) =>
            patch({ business_model: { ...draft.business_model, how_it_makes_money: v } })
          }
        />
        <Area
          label="Pricing"
          rows={3}
          value={draft.business_model.pricing}
          onChange={(v) => patch({ business_model: { ...draft.business_model, pricing: v } })}
        />
        <Area
          label="Why I chose this pricing"
          rows={3}
          value={draft.business_model.why_this_pricing}
          onChange={(v) =>
            patch({ business_model: { ...draft.business_model, why_this_pricing: v } })
          }
        />
        <Area
          label="What I'd test next"
          rows={3}
          value={draft.business_model.what_id_test_next}
          onChange={(v) =>
            patch({ business_model: { ...draft.business_model, what_id_test_next: v } })
          }
        />

        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          11 · 3 ideas you can build from this
        </h3>
        {draft.three_build_ideas.length !== 3 && (
          <p className="text-[11px] font-semibold text-amber-700">
            Every build should have exactly three ideas. This one has{' '}
            {draft.three_build_ideas.length}.
          </p>
        )}
        <Repeater
          label="Ideas"
          items={draft.three_build_ideas}
          onChange={(three_build_ideas) => patch({ three_build_ideas })}
          blank={() => ({ name: '', description: '', who_its_for: '', mvp: '' })}
          addLabel="Add an idea"
          render={(idea, update) => (
            <>
              <Text label="Idea name" value={idea.name} onChange={(v) => update({ name: v })} />
              <Area
                label="One-sentence description"
                rows={2}
                value={idea.description}
                onChange={(v) => update({ description: v })}
              />
              <Text
                label="Who it's for"
                value={idea.who_its_for}
                onChange={(v) => update({ who_its_for: v })}
              />
              <Area
                label="Simplest MVP"
                rows={2}
                value={idea.mvp}
                onChange={(v) => update({ mvp: v })}
              />
            </>
          )}
        />

        <h3 className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          12 · Build it yourself
        </h3>
        <Lines
          label="Checklist"
          rows={7}
          value={draft.build_checklist}
          onChange={(v) => patch({ build_checklist: v })}
        />
      </section>

      {/* 13. Build Pack + email */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          13 · Build Pack and email
        </h3>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label className={LABEL}>Build Pack files</label>
          {!draft.slug ? (
            <p className="text-xs text-slate-500">Save the build once to enable uploads.</p>
          ) : (
            <>
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-colors hover:border-teal-accent/40 ${
                  uploading ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                <span className="text-sm font-semibold text-slate-900">
                  {uploading ? 'Uploading...' : 'Click to upload a file'}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Prompt pack, checklist, notes — any format.
                </span>
                <input type="file" onChange={uploadPack} className="hidden" />
              </label>

              {packFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {packFiles.map((f) => (
                    <li
                      key={f.url}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-2.5"
                    >
                      <label className="flex min-w-0 items-center gap-2.5">
                        <input
                          type="radio"
                          name="download_file"
                          checked={draft.download_file === f.name}
                          onChange={() => patch({ download_file: f.name })}
                          className="h-4 w-4 accent-[#2563eb]"
                        />
                        <span className="truncate text-xs font-semibold text-slate-700">
                          {f.name}
                        </span>
                      </label>
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => copy(f.url, f.url)}
                          className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider text-teal-accent hover:underline"
                        >
                          {copied === f.url ? 'Copied!' : 'Copy URL'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePack(f)}
                          className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[11px] text-slate-400">
                The selected file is what the signup form hands over. Screenshots uploaded here
                also work as the hero image — copy the URL into the field above.
              </p>
            </>
          )}
        </div>

        <Text
          label="Email tag"
          value={draft.email_tag}
          onChange={(v) => patch({ email_tag: v })}
          placeholder={`${SECTION_EMAIL_TAG} - ${draft.title || 'Build name'}`}
          hint={`Every signup is also tagged "${SECTION_EMAIL_TAG}". Leave empty to generate this from the title.`}
        />
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
          SEO
        </h3>
        <Text
          label="Page title"
          value={draft.seo_title}
          onChange={(v) => patch({ seo_title: v })}
          placeholder={`How I Built ${draft.title || '...'} | Build With Me`}
          hint="Leave empty to use the generated title above."
        />
        <Area
          label="Meta description"
          rows={3}
          value={draft.seo_description}
          onChange={(v) => patch({ seo_description: v })}
          hint="Leave empty to use the one-line description."
        />
        <Text
          label="Open Graph image URL"
          value={draft.og_image}
          onChange={(v) => patch({ og_image: v })}
          hint="1200x630. Falls back to the hero image, then the site image."
        />
      </section>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-6">
        <button
          onClick={() => save()}
          disabled={saving}
          className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
          type="button"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setDraft(null)}
          className="btn-secondary px-5 py-3 text-sm"
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
