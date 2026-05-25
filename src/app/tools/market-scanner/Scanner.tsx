"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

const EXAMPLES = [
  {
    label: "AI Legal Agent",
    desc: "AI assistant for contractor agreement safety analysis.",
    concept: "An AI legal assistant for mid-market construction firms that analyzes contractor agreements against state safety regulations.",
    competitors: "Harvey AI, CoCounsel, LexisNexis",
    differentiation: "Proprietary database of municipal building codes and automated safety risk-scoring.",
  },
  {
    label: "Audio Substack",
    desc: "Private podcast hosting and monetization for writers.",
    concept: "A subscription audio newsletter platform for independent journalists to easily record, host, and monetize private podcasts.",
    competitors: "Substack, Spotify, Apple Podcasts",
    differentiation: "Frictionless voice-to-text recording pipeline with automated audiogram social shares.",
  },
  {
    label: "Micro-SaaS Billing",
    desc: "Usage-based in-editor billing for VS Code extensions.",
    concept: "A billing widget designed specifically for VS Code extension developers to charge usage-based subscription pricing directly in-editor.",
    competitors: "Stripe, Paddle, Lemon Squeezy",
    differentiation: "Pre-built VS Code auth token wrapper and micro-transaction fee optimization.",
  },
];

interface AxisConfig {
  xLeft: string;
  xRight: string;
  yBottom: string;
  yTop: string;
}

interface Coordinate {
  label: string;
  x: number;
  y: number;
  isSelf: boolean;
}

interface Vulnerability {
  competitorName: string;
  strength: string;
  vulnerability: string;
}

interface GTMPlay {
  title: string;
  description: string;
}

export default function Scanner() {
  const [concept, setConcept] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [differentiation, setDifferentiation] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Parsed Response States
  const [axes, setAxes] = useState<AxisConfig | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [whiteSpace, setWhiteSpace] = useState("");
  const [gtmPlays, setGtmPlays] = useState<GTMPlay[]>([]);
  const [rawText, setRawText] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  const parseResult = (text: string) => {
    setRawText(text);

    // 1. Parse Axes
    let axisXLeft = "Low Integration";
    let axisXRight = "High Integration";
    let axisYBottom = "Generic Features";
    let axisYTop = "Niche Automations";

    const axisXMatch = text.match(/\-\s+\*\*Axis X \(Horizontal\)\*\*\s*:\s*(.+?)\s+vs\s+(.+)/i);
    if (axisXMatch) {
      axisXLeft = axisXMatch[1].trim();
      axisXRight = axisXMatch[2].trim();
    }

    const axisYMatch = text.match(/\-\s+\*\*Axis Y \(Vertical\)\*\*\s*:\s*(.+?)\s+vs\s+(.+)/i);
    if (axisYMatch) {
      axisYBottom = axisYMatch[1].trim();
      axisYTop = axisYMatch[2].trim();
    }

    setAxes({
      xLeft: axisXLeft,
      xRight: axisXRight,
      yBottom: axisYBottom,
      yTop: axisYTop,
    });

    // 2. Parse Coordinates
    const tempCoords: Coordinate[] = [];
    const coordLines = text.match(/\-\s+\*\*([^*]+)\*\*\s*:\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g);
    if (coordLines) {
      coordLines.forEach((line) => {
        const match = line.match(/\-\s+\*\*([^*]+)\*\*\s*:\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
        if (match) {
          const label = match[1].trim();
          const x = parseInt(match[2]);
          const y = parseInt(match[3]);
          tempCoords.push({
            label,
            x,
            y,
            isSelf: label.toLowerCase() === "your startup",
          });
        }
      });
    }
    setCoordinates(tempCoords);

    // 3. Parse Competitor Vulnerabilities
    const vulnSectionMatch = text.match(/## Competitor Vulnerabilities([\s\S]*?)## The White Space/i);
    const tempVulns: Vulnerability[] = [];
    if (vulnSectionMatch) {
      const vulnSectionText = vulnSectionMatch[1];
      const items = vulnSectionText.split(/\d+\.\s+\*\*/);
      items.forEach((item) => {
        if (!item.trim()) return;
        const parts = item.split(/\*\*\s*\n?/);
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const details = parts[1];
          const strengthMatch = details.match(/\-\s+\*\*Incumbent Strength\*\*\s*:\s*(.*)/i);
          const vulnMatch = details.match(/\-\s+\*\*Fatal Vulnerability\*\*\s*:\s*(.*)/i);

          tempVulns.push({
            competitorName: name,
            strength: strengthMatch ? strengthMatch[1].trim() : "Established market position.",
            vulnerability: vulnMatch ? vulnMatch[1].trim() : "High cost and general-purpose tooling.",
          });
        }
      });
    }
    setVulnerabilities(tempVulns);

    // 4. Parse The White Space
    const whiteSpaceMatch = text.match(/## The White Space\s*\n+([\s\S]*?)(?:\n+##|$)/i);
    if (whiteSpaceMatch) {
      setWhiteSpace(whiteSpaceMatch[1].trim());
    }

    // 5. Parse Tactical GTM Infiltration Plan
    const gtmSectionMatch = text.match(/## Tactical GTM Infiltration Plan([\s\S]*)$/i);
    const tempPlays: GTMPlay[] = [];
    if (gtmSectionMatch) {
      const lines = gtmSectionMatch[1].split("\n");
      lines.forEach((line) => {
        const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*[:\s]*(.*)/);
        if (match) {
          tempPlays.push({
            title: match[1].trim(),
            description: match[2].trim(),
          });
        }
      });
    }
    setGtmPlays(tempPlays);
  };

  const handleScan = async () => {
    if (!concept.trim() || !competitors.trim() || loading) return;
    setLoading(true);
    setErr(null);
    setAxes(null);
    setCoordinates([]);
    setVulnerabilities([]);
    setWhiteSpace("");
    setGtmPlays([]);
    setRawText("");

    try {
      const response = await fetch("/api/market-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept, competitors, differentiation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scan market.");
      }

      const data = await response.json();
      parseResult(data.text);
    } catch (e: any) {
      setErr(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setConcept(ex.concept);
    setCompetitors(ex.competitors);
    setDifferentiation(ex.differentiation);
  };

  useEffect(() => {
    if (rawText && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [rawText]);

  // SVG dimensions & grid mapping calculations
  const svgWidth = 320;
  const svgHeight = 320;
  const padding = 40;
  const mapCoordToSvg = (val: number, isX: boolean) => {
    const clamped = Math.max(-5, Math.min(5, val));
    const range = svgWidth - padding * 2;
    const center = svgWidth / 2;
    const step = range / 10;
    return isX ? center + clamped * step : center - clamped * step;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 3px signature bar */}
      <div className="h-[3px] w-full bg-sig-bar" />

      <div className="max-w-3xl mx-auto px-6 py-12 pb-24 space-y-8">
        {/* Navigation back */}
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors no-underline"
          >
            &larr; BACK TO TOOLS
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-slate-light rounded-2xl p-8 relative overflow-hidden border border-slate-200 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-teal-accent flex items-center justify-center text-white text-[9px] font-bold">
              RN
            </div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">
              Ramesh Nuti &middot; Svyam Ventures
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-none text-slate-900">
            Market Scanner &amp;
            <br />
            <span className="text-teal-accent">Strategic Positioner.</span>
          </h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-lg">
            Stop generating copy-paste competitor tables. Map out incumbents on dynamically derived competitive axes, expose their fatal product vulnerabilities, and extract GTM plays to capture their underserved customers.
          </p>
        </div>

        {/* Input area */}
        <div className="space-y-5 text-left">
          {/* Concept input */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. What is your startup concept?
            </label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="E.g., An AI-powered legal assistant for mid-market construction firms that analyzes contractor agreements against local municipal building codes."
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Competitors and Edge in a two-column/stacked layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Key Competitors (comma separated):
              </label>
              <input
                type="text"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="E.g., Harvey AI, CoCounsel, LexisNexis"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Differentiator / Claimed Edge:
              </label>
              <input
                type="text"
                value={differentiation}
                onChange={(e) => setDifferentiation(e.target.value)}
                placeholder="E.g., Municipal code API database (Optional)"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
              />
            </div>
          </div>

          {/* Example chips */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Or click an example to load:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(ex)}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors duration-200 text-left"
                >
                  <strong className="block text-slate-900">{ex.label}</strong>
                  <span className="text-[10px] text-slate-400 font-normal">{ex.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Action */}
          <button
            onClick={handleScan}
            disabled={!concept.trim() || !competitors.trim() || loading}
            className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
              loading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : concept.trim() && competitors.trim()
                ? "btn-primary shadow-sm active:scale-[0.99]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            {loading ? "Scanning competitive space..." : "Scan Market & Find Gaps &arr;"}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-3 justify-center py-4 bg-slate-light rounded-xl border border-slate-200 animate-pulse">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-teal-accent rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Mapping incumbents and extracting product vulnerabilities...
            </span>
          </div>
        )}

        {err && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-700 text-left">
            {err}
          </div>
        )}

        {/* Results output */}
        {rawText && (
          <div ref={resultRef} className="space-y-8 pt-4 text-left">
            <div className="h-[1px] w-full bg-slate-200 rounded" />

            {/* Positioning Grid and Map */}
            {axes && coordinates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                
                {/* SVG 2x2 grid (Left column) */}
                <div className="md:col-span-6 flex justify-center">
                  <div className="relative p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <svg
                      width={svgWidth}
                      height={svgHeight}
                      className="overflow-visible"
                    >
                      {/* Grid background lines */}
                      {Array.from({ length: 11 }).map((_, idx) => {
                        const val = idx - 5;
                        const linePos = mapCoordToSvg(val, true);
                        return (
                          <g key={idx}>
                            {/* Vertical grid lines */}
                            <line
                              x1={linePos}
                              y1={padding}
                              x2={linePos}
                              y2={svgHeight - padding}
                              stroke={val === 0 ? "#cbd5e1" : "#f1f5f9"}
                              strokeWidth={val === 0 ? 1.5 : 1}
                              strokeDasharray={val === 0 ? undefined : "2 2"}
                            />
                            {/* Horizontal grid lines */}
                            <line
                              x1={padding}
                              y1={linePos}
                              x2={svgWidth - padding}
                              y2={linePos}
                              stroke={val === 0 ? "#cbd5e1" : "#f1f5f9"}
                              strokeWidth={val === 0 ? 1.5 : 1}
                              strokeDasharray={val === 0 ? undefined : "2 2"}
                            />
                          </g>
                        );
                      })}

                      {/* Plotted coordinates */}
                      {coordinates.map((coord, idx) => {
                        const cx = mapCoordToSvg(coord.x, true);
                        const cy = mapCoordToSvg(coord.y, false);

                        return (
                          <g key={idx} className="group cursor-default">
                            {/* Dotted lines from point to axes */}
                            <line
                              x1={cx}
                              y1={cy}
                              x2={160} // Center X
                              y2={cy}
                              stroke={coord.isSelf ? "#2563eb50" : "#94a3b850"}
                              strokeWidth={1}
                              strokeDasharray="2 2"
                            />
                            <line
                              x1={cx}
                              y1={cy}
                              x2={cx}
                              y2={160} // Center Y
                              stroke={coord.isSelf ? "#2563eb50" : "#94a3b850"}
                              strokeWidth={1}
                              strokeDasharray="2 2"
                            />

                            {/* Point circles */}
                            {coord.isSelf ? (
                              <>
                                {/* Pulse animation ring */}
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={10}
                                  fill="none"
                                  stroke="#2563eb"
                                  strokeWidth={2}
                                  className="animate-ping opacity-30"
                                />
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={6}
                                  fill="#2563eb"
                                  className="transition-transform duration-300 group-hover:scale-125"
                                />
                              </>
                            ) : (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={5}
                                fill="#64748b"
                                className="transition-transform duration-300 group-hover:scale-125"
                              />
                            )}

                            {/* Text labels */}
                            <text
                              x={cx}
                              y={cy - 10}
                              textAnchor="middle"
                              className={`text-[9px] font-mono font-bold ${
                                coord.isSelf ? "fill-blue-600" : "fill-slate-500"
                              }`}
                            >
                              {coord.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Axes and position details (Right column) */}
                <div className="md:col-span-6 space-y-4 text-left">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-accent uppercase tracking-widest block mb-1">
                      Dynamically Mapped Axes
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      The Vectors of Competition
                    </h4>
                  </div>
                  
                  <div className="space-y-3 font-mono text-[11px] text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded-xl">
                    <div className="space-y-1">
                      <span className="text-slate-400 block uppercase font-bold">X Axis (Horizontal):</span>
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>&larr; {axes.xLeft}</span>
                        <span>{axes.xRight} &rarr;</span>
                      </div>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-200" />
                    
                    <div className="space-y-1">
                      <span className="text-slate-400 block uppercase font-bold">Y Axis (Vertical):</span>
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>&darr; {axes.yBottom}</span>
                        <span>{axes.yTop} &uarr;</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hover or view plotted points on the positioning matrix to see competitor placements relative to the untapped sector.
                  </p>
                </div>
              </div>
            )}

            {/* The White Space Gap */}
            {whiteSpace && (
              <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-accent" />
                <span className="inline-block text-[9px] font-mono font-bold tracking-wider uppercase text-teal-accent">
                  identified market gap
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  The White Space Opportunity
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{whiteSpace}&rdquo;
                </p>
              </div>
            )}

            {/* Competitor Vulnerabilities */}
            {vulnerabilities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Incumbent Vulnerability Scan
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm"
                    >
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        {vuln.competitorName}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <strong className="text-slate-400 uppercase tracking-wide block">Strength to Avoid:</strong>
                          <p className="text-slate-600 font-sans text-sm leading-relaxed">{vuln.strength}</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-red-500 uppercase tracking-wide block">Fatal Vulnerability:</strong>
                          <p className="text-slate-600 font-sans text-sm leading-relaxed">{vuln.vulnerability}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tactical GTM Infiltration Plan */}
            {gtmPlays.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-[3px] w-full bg-blue-600" />
                <div className="p-6 md:p-8 space-y-4">
                  <span className="inline-block px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-blue-50 text-blue-600">
                    Tactical Infiltration Plays
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    How to Siphon Incumbents' Customers
                  </h3>
                  <div className="space-y-5 pt-2">
                    {gtmPlays.map((play, index) => (
                      <div key={index} className="text-sm leading-relaxed border-l-2 border-slate-100 pl-4">
                        <strong className="text-slate-950 font-bold block mb-1">
                          {index + 1}. {play.title}
                        </strong>
                        <span className="text-slate-600">{play.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Test another pitch */}
            <button
              onClick={() => {
                setRawText("");
                setConcept("");
                setCompetitors("");
                setDifferentiation("");
                setAxes(null);
                setCoordinates([]);
                setVulnerabilities([]);
                setWhiteSpace("");
                setGtmPlays([]);
              }}
              className="w-full py-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Scan Another Startup Proposal
            </button>

            {/* Newsletter Box */}
            <div className="bg-slate-light rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-center space-y-4">
              <span className="text-[9px] font-mono font-bold tracking-widest text-teal-accent uppercase">
                newsletter signup
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Found these blind spots useful?</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Subscribe to get my private prompt models, n8n agent templates, and founder plays.
                </p>
              </div>
              <div className="max-w-sm mx-auto pt-2">
                <NewsletterForm variant="standard" buttonText="Subscribe Free" placeholder="Enter your email" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
