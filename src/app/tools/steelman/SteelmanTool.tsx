'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { NewsletterForm } from "@/components/NewsletterForm";

const EX = [
  'Add AI features to a legacy B2B SaaS',
  'Bootstrap a SaaS instead of raising venture capital',
  'Vibe code our MVP instead of hiring a developer',
  'Pivot a consulting firm to a SaaS product',
];

const SECTIONS = [
  { tag: '01 / Vulnerability', color: '#2563eb', bg: '#eff6ff', tc: '#2563eb' },
  { tag: '02 / Skeptic Arguments', color: '#475569', bg: '#f8fafc', tc: '#475569' },
  { tag: '03 / The Devastating Question', color: '#0f172a', bg: '#f1f5f9', tc: '#0f172a' },
];

function Typewriter({ text, speed = 8, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
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

export default function SteelmanTool() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Section[] | null>(null);
  const [raw, setRaw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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

  const copyResults = () => {
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareTemplate = () => {
    const postText = `I ran my startup idea ("${idea}") through Ramesh Nuti's Steelman AI tool. 

It analyzed execution risks and founder blind spots, pointing out the exact objections investors would raise. 

Try it for free here to test your own business model: https://rameshnuti.com/tools/steelman`;
    navigator.clipboard.writeText(postText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 3px signature bar */}
      <div className="h-[3px] w-full bg-sig-bar" />
      
      <div className="max-w-[620px] mx-auto px-6 py-12 pb-24 space-y-8">
        
        {/* Navigation back */}
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors no-underline"
        >
          &larr; BACK TO TOOLS
        </Link>

        {/* Hero Card */}
        <div className="bg-slate-light rounded-2xl p-8 relative overflow-hidden border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-teal-accent flex items-center justify-center text-white text-[9px] font-bold">RN</div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">Ramesh Nuti &middot; Vibe Coder OS</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-none text-slate-900">
            Steelman the
            <br />
            <span className="text-teal-accent">Opposition.</span>
          </h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-sm">
            Put your proposal in front of the smartest skeptic in the room. Get the arguments investors and customers will use against you.
          </p>

          <div className="flex gap-2 flex-wrap mt-5">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-teal-50 border border-teal-100 text-teal-accent">2x Founder</span>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">25+ investments</span>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">vibe coder</span>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter your proposal or startup pitch:
            </label>
            <textarea 
              value={idea} 
              onChange={e => setIdea(e.target.value)}
              placeholder="e.g., We want to build an AI agent for real estate brokers that automates lead nurturing..."
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Example chips */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Or click an example to load:
            </p>
            <div className="flex flex-wrap gap-2">
              {EX.map((ex, i) => {
                const colors = [
                  'bg-teal-50 border-teal-100 text-teal-800 hover:bg-teal-100/50',
                  'bg-indigo-50 border-indigo-100 text-indigo-800 hover:bg-indigo-100/50',
                  'bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100/50',
                  'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/80',
                ];
                return (
                  <button 
                    key={i} 
                    onClick={() => setIdea(ex)}
                    className={`border rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors duration-200 ${colors[i % colors.length]}`}
                  >
                    {ex}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Action */}
          <button 
            onClick={go} 
            disabled={!idea.trim() || loading}
            className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : idea.trim() 
                  ? 'btn-primary shadow-sm active:scale-[0.99]' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {loading ? 'Analyzing blind spots...' : 'Steelman the Opposition &rarr;'}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-3 justify-center py-4 bg-slate-light rounded-xl border border-slate-200 animate-pulse">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-teal-accent rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Generating skeptic feedback...
            </span>
          </div>
        )}

        {err && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-700 text-left">
            {err}
          </div>
        )}

        {/* Result Area */}
        {raw && (
          <div ref={ref} className="space-y-6 pt-4 text-left">
            <div className="h-[1px] w-full bg-slate-200 rounded" />

            {result && !show && !done && (
              <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 font-mono text-xs leading-relaxed space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[9px] font-bold text-teal-accent tracking-wider">STREAMING ANALYSIS...</span>
                  <button 
                    onClick={() => { setDone(true); setShow(true); }}
                    className="bg-white hover:bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-[9px] text-slate-600 cursor-pointer"
                  >
                    skip typing
                  </button>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
                  <Typewriter text={raw} speed={6} onComplete={() => { setDone(true); setShow(true); }} />
                  <span className="inline-block w-1.5 h-3 bg-teal-accent ml-1 animate-blink" />
                </div>
              </div>
            )}

            {show && result && (
              <div className="space-y-6 animate-fade-up">
                <div className="space-y-4">
                  {result.map((s, si) => {
                    const cfg = SECTIONS[si] || SECTIONS[0];
                    return (
                      <div key={si} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        {/* 3px Section border color top */}
                        <div className="h-[3px] w-full" style={{ background: cfg.color }} />
                        
                        <div className="p-6 space-y-3">
                          <span 
                            className="inline-block px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase"
                            style={{ background: cfg.bg, color: cfg.tc }}
                          >
                            {cfg.tag}
                          </span>
                          
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{s.title}</h3>
                          
                          <div className="space-y-3 pt-2">
                            {s.pts.map((p, pi) => (
                              <div key={pi} className="text-sm leading-relaxed">
                                {p.l && (
                                  <strong className="text-slate-900 block sm:inline font-sans font-bold mr-1" style={{ color: cfg.color }}>
                                    {p.l}:
                                  </strong>
                                )}{" "}
                                <span className="text-slate-600 font-sans">{p.d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Post-analysis actions */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={copyResults}
                    className="w-full py-3.5 px-4 btn-secondary text-xs font-bold font-sans transition-all flex items-center justify-center gap-2"
                  >
                    <span>{copied ? '✓ Copied Analysis' : '📋 Copy Critique'}</span>
                  </button>

                  <button 
                    onClick={copyShareTemplate}
                    className="w-full py-3.5 px-4 bg-transparent border border-teal-accent hover:bg-teal-accent/5 text-teal-accent rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{copiedLink ? '✓ Post Draft Copied!' : '🔗 Copy LinkedIn Post Draft'}</span>
                  </button>
                </div>

                <button 
                  onClick={() => { setResult(null); setRaw(''); setIdea(''); setShow(false); setDone(false); }}
                  className="w-full py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold font-sans transition-colors cursor-pointer"
                >
                  Test Another Idea
                </button>

                {/* Newsletter Box */}
                <div className="bg-slate-light rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-teal-accent uppercase">
                    newsletter signup
                  </span>
                  
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">Found these blind spots useful?</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                      Subscribe to get my private prompt models, n8n agent templates, and vibe coding tips.
                    </p>
                  </div>
                  
                  <div className="max-w-sm mx-auto">
                    <NewsletterForm sourceTag="tool-steelman" variant="standard" buttonText="Subscribe Free" placeholder="Enter your email" />
                  </div>
                </div>
              </div>
            )}

            {!result && raw && (
              <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                {raw}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
