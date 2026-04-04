// app/tools/steelman/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

const EX = [
  'We should add AI features to our legacy B2B SaaS',
  'We should bootstrap instead of raising a round',
  'We should vibe code our MVP instead of hiring',
  'We should pivot from services to product',
];

const C = {
  mid: '#1A1A3E',
  teal: '#4ADE80', tealLight: '#CCFBF1', tealText: '#115E59',
  terra: '#C2694A', terraLight: '#F5E0D8', terraText: '#6B3424',
  violet: '#8B5CF6', violetLight: '#EDE9FE', violetText: '#5B21B6',
  sigGrad: 'linear-gradient(135deg, #1A1A3E 0%, #4ADE80 100%)',
  fullBar: 'linear-gradient(90deg, #1A1A3E 0%, #4ADE80 40%, #C2694A 70%, #8B5CF6 100%)',
  sigBar: 'linear-gradient(90deg, #1A1A3E 0%, #4ADE80 100%)',
};

const SECTIONS = [
  { tag: '01 / Vulnerability', color: C.teal, bg: C.tealLight, tc: C.tealText },
  { tag: '02 / Arguments', color: C.terra, bg: C.terraLight, tc: C.terraText },
  { tag: '03 / The Question', color: C.violet, bg: C.violetLight, tc: C.violetText },
];

function Typewriter({ text, speed = 10, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [d, setD] = useState('');
  const i = useRef(0);
  useEffect(() => { i.current = 0; setD(''); }, [text]);
  useEffect(() => {
    if (i.current < text.length) {
      const t = setTimeout(() => {
        i.current++;
        setD(text.slice(0, i.current));
        if (i.current >= text.length && onComplete) onComplete();
      }, speed);
      return () => clearTimeout(t);
    }
  }, [d, text, speed, onComplete]);
  return <>{d}</>;
}

interface Section {
  title: string;
  pts: { l: string; d: string }[];
}

function parse(text: string): Section[] | null {
  const s: Section[] = [];
  const l = text.split('\n');
  let c: Section | null = null;
  for (const ln of l) {
    const h = ln.match(/^##\s+(.+)/);
    const n = ln.match(/^\d+\.\s+\*\*(.+?)\*\*[:\s]*(.*)/);
    const b = ln.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
    if (h) { if (c) s.push(c); c = { title: h[1], pts: [] }; }
    else if (n && c) c.pts.push({ l: n[1], d: n[2] });
    else if (b && c) c.pts.push({ l: b[1], d: b[2] });
    else if (ln.trim() && c) {
      if (c.pts.length) c.pts[c.pts.length - 1].d += ' ' + ln.trim();
      else c.pts.push({ l: '', d: ln.trim() });
    }
  }
  if (c) s.push(c);
  return s.length ? s : null;
}

export default function SteelmanPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Section[] | null>(null);
  const [raw, setRaw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const go = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true); setResult(null); setRaw(''); setErr(null); setShow(false); setDone(false);
    try {
      const r = await fetch('/api/steelman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      if (!r.ok) throw new Error('API error');
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setRaw(d.text);
      setResult(parse(d.text));
    } catch (e: any) {
      setErr(e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (raw && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [raw]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="h-[5px]" style={{ background: C.fullBar }} />
      <div className="max-w-[580px] mx-auto px-6 py-11 pb-15">

        {/* Hero */}
        <div className="bg-midnight rounded-[14px] p-7 pb-6 mb-8 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(194,105,74,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-[30px] h-[30px] rounded-full bg-[linear-gradient(135deg,#1A1A3E_0%,#4ADE80_100%)] flex items-center justify-center text-white text-[10px] font-bold">RN</div>
            <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-teal-mint">Ramesh Nuti</span>
          </div>

          <h1 className="text-[38px] font-bold leading-[1.05] text-white tracking-[-0.03em] m-0">
            Steelman<br /><span className="text-teal-mint">the Opposition.</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/50 mt-3 max-w-[400px]">
            Paste your idea. Get the strongest possible arguments against it before you walk into the room.
          </p>

          <div className="flex gap-1.5 flex-wrap mt-4">
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-teal-mint/15 text-teal-mint">2x founder</span>
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-terra-400/20 text-terra-400">25+ investments</span>
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-violet-400/20 text-violet-400">vibe coder</span>
          </div>
        </div>

        {/* Input */}
        <textarea value={idea} onChange={e => setIdea(e.target.value)}
          placeholder="Your idea, pitch, or proposal..."
          rows={3}
          className="w-full bg-surface border-2 border-gray-200 rounded-lg px-4 py-3.5 text-[15px] font-mono text-foreground resize-y outline-none leading-relaxed transition-colors focus:border-violet-400"
        />

        {/* Example chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5 mb-4">
          {EX.map((ex, i) => {
            const cls = [
              'bg-teal-50 text-teal-800',
              'bg-violet-50 text-violet-800',
              'bg-terra-light text-terra-800',
              'bg-teal-50 text-teal-800',
            ];
            return (
              <button key={i} onClick={() => setIdea(ex)}
                className={`border-none rounded-md px-2.5 py-[5px] text-[11px] font-medium cursor-pointer font-sans ${cls[i]}`}
              >{ex}</button>
            );
          })}
        </div>

        {/* CTA */}
        <button onClick={go} disabled={!idea.trim() || loading}
          className={`w-full py-3.5 px-6 border-none rounded-lg text-[15px] font-bold font-sans transition-all ${
            loading ? 'bg-gray-100 text-text-muted cursor-not-allowed' :
            idea.trim() ? 'bg-teal-mint text-midnight cursor-pointer hover:opacity-90' :
            'bg-gray-100 text-text-muted cursor-not-allowed'
          }`}>
          {loading ? 'Thinking...' : 'Steelman the Opposition'}
        </button>

        {loading && (
          <div className="mt-5 flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-teal-mint rounded-full animate-spin" />
            <span className="text-[13px] text-text-muted italic">Finding your blind spots...</span>
          </div>
        )}

        {err && <div className="mt-5 px-4 py-3 bg-terra-light rounded-lg text-[13px] text-terra-800 font-medium">{err}</div>}

        {/* Results */}
        {raw && (
          <div ref={ref} className="mt-8">
            <div className="h-1 rounded-sm mb-6" style={{ background: C.fullBar }} />

            {result && !show && !done && (
              <div className="text-sm leading-[1.8] text-text-secondary">
                <Typewriter text={raw} speed={8} onComplete={() => { setDone(true); setShow(true); }} />
                <span className="inline-block w-0.5 h-[15px] bg-teal-mint ml-px animate-blink align-text-bottom" />
                <button onClick={() => { setDone(true); setShow(true); }}
                  className="block mt-3 bg-violet-50 border-none rounded-md px-3 py-[5px] text-[11px] text-violet-800 cursor-pointer font-mono font-medium">skip</button>
              </div>
            )}

            {show && result && (
              <div className="animate-[fadeUp_0.35s_ease-out]">
                {result.map((s, si) => {
                  const cfg = SECTIONS[si] || SECTIONS[0];
                  return (
                    <div key={si} className="mb-3 bg-midnight rounded-[10px] overflow-hidden">
                      <div className="h-[3px]" style={{ background: cfg.color }} />
                      <div className="px-5 py-4">
                        <div className="inline-block px-2.5 py-[3px] rounded text-[10px] font-bold tracking-[0.08em] uppercase font-mono mb-2.5"
                          style={{ background: `${cfg.color}20`, color: cfg.color }}>{cfg.tag}</div>
                        <h3 className="text-[17px] font-bold text-white mt-0 mb-2.5">{s.title}</h3>
                        {s.pts.map((p, pi) => (
                          <div key={pi} className={pi < s.pts.length - 1 ? 'mb-2.5' : ''}>
                            {p.l && <span className="text-sm font-bold text-white/90">{p.l} </span>}
                            <span className="text-sm text-white/50 leading-relaxed">{p.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => { setResult(null); setRaw(''); setIdea(''); setShow(false); setDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full py-3 bg-transparent border-2 border-terra-400 rounded-lg text-sm text-terra-400 cursor-pointer font-bold font-sans mt-2 transition-colors hover:bg-terra-400 hover:text-white">
                  Test another idea
                </button>

                {/* Newsletter CTA after results */}
                <div className="mt-6 bg-surface border border-gray-200 rounded-lg p-5 text-center">
                  <p className="text-sm font-bold text-foreground mb-1">Found this useful?</p>
                  <p className="text-xs text-text-secondary mb-3">Get weekly AI tools, frameworks, and building tips.</p>
                  <iframe
                    src="https://startupvalue.substack.com/embed"
                    width="100%"
                    height="150"
                    className="border-0 rounded-lg bg-white"
                    title="Newsletter signup"
                  />
                </div>
              </div>
            )}

            {!result && raw && <div className="text-sm leading-[1.8] text-text-secondary whitespace-pre-wrap">{raw}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
