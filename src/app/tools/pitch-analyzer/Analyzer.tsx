"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

const EXAMPLES = [
  {
    label: "Permit Solar CRM",
    desc: "B2B Solar CRM targeting manual paperwork issues.",
    text: `Company Name: SunPermits CRM
Concept: A CRM specifically for solar panel installers that integrates with local county databases to automate permit checking.

Slides outline:
1. Title: SunPermits - CRM for Solar Installers
2. Problem: Solar installers waste 10-15 hours per week checking local permit status manually. Projects get delayed by weeks.
3. Solution: Our solar CRM automatically polls county databases and sends push notifications on permit approvals.
4. Market Size: 15,000 solar installation companies in the US, paying $200/mo. TAM is $36M.
5. GTM: Cold email outbound, SEO content, and exhibiting at solar trade shows.
6. Moat: Speed of direct database integrations and custom API connectors.`,
  },
  {
    label: "Local Gym Matcher",
    desc: "A location-based gym buddy matching social app.",
    text: `Company Name: GymBuddy App
Concept: A Tinder-style social video matching app for gym partners based on location, workouts, and fitness goals.

Slides outline:
1. Title: GymBuddy - Find Your Workout Partner
2. Problem: Gym members drop out after 3 months because working out alone is boring and lacks accountability.
3. Solution: A swipe-based social video sharing app that matches gym partners nearby.
4. Market Size: 60 Million gym members in the US. If 5% pay a $5 subscription, our revenue is $15M/mo.
5. GTM: Paid ads on TikTok, partnering with local gym chains, and student brand ambassadors.
6. Moat: Social network effects and community brand.`,
  },
  {
    label: "Enterprise AI Audit",
    desc: "AI agent auditing system for regulatory compliance.",
    text: `Company Name: CertifyAI
Concept: An automated compliance audit platform that analyzes enterprise LLM outputs to guarantee zero regulatory violations.

Slides outline:
1. Title: CertifyAI - Compliant Enterprise AI
2. Problem: Fortune 500 legal teams block AI adoption because LLM outputs might violate state regulations (e.g. HIPAA, SOC2).
3. Solution: Real-time API firewall that audits, scores, and blocks regulatory violations in AI chats.
4. Market Size: 2,500 regulated large enterprises. Selling annual contracts at $80,000. TAM is $200M.
5. GTM: Direct enterprise sales targeting Chief Legal Officers and Chief Information Security Officers.
6. Moat: Proprietary dataset of regulatory compliance rules and enterprise security clearance.`,
  },
];

interface Score {
  label: string;
  value: number;
  justification: string;
}

interface RoastPoint {
  title: string;
  detail: string;
}

interface Formulation {
  problem: string;
  targetUser: string;
  triggerMoment: string;
  proposedSolution: string;
}

export default function Analyzer() {
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  
  // Parsed Response States
  const [pitchTitle, setPitchTitle] = useState("");
  const [formulation, setFormulation] = useState<Formulation | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [failureModes, setFailureModes] = useState<RoastPoint[]>([]);
  const [frictionPoints, setFrictionPoints] = useState<RoastPoint[]>([]);
  const [finalVerdict, setFinalVerdict] = useState("");
  const [verdictRationale, setVerdictRationale] = useState("");
  const [fastestV1, setFastestV1] = useState("");
  const [validationTest, setValidationTest] = useState("");
  const [rawText, setRawText] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  const parseResult = (text: string) => {
    setRawText(text);

    // 1. Parse Pitch Title
    const titleMatch = text.match(/## Pitch Title\s*\n+([^\n]+)/i);
    setPitchTitle(titleMatch ? titleMatch[1].trim() : "Startup Proposal Stress Test");

    // 2. Parse Normalized Formulation
    const problemMatch = text.match(/\-\s+\*\*Problem\*\*\s*:\s*([^\n]+)/i);
    const targetUserMatch = text.match(/\-\s+\*\*Target User\*\*\s*:\s*([^\n]+)/i);
    const triggerMomentMatch = text.match(/\-\s+\*\*Trigger Moment\*\*\s*:\s*([^\n]+)/i);
    const proposedSolutionMatch = text.match(/\-\s+\*\*Proposed Solution\*\*\s*:\s*([^\n]+)/i);

    if (problemMatch || targetUserMatch || triggerMomentMatch || proposedSolutionMatch) {
      setFormulation({
        problem: problemMatch ? problemMatch[1].trim() : "Ambiguous",
        targetUser: targetUserMatch ? targetUserMatch[1].trim() : "Ambiguous",
        triggerMoment: triggerMomentMatch ? triggerMomentMatch[1].trim() : "Ambiguous",
        proposedSolution: proposedSolutionMatch ? proposedSolutionMatch[1].trim() : "Ambiguous",
      });
    } else {
      setFormulation(null);
    }

    // 3. Parse Scores and Justifications
    const tempScores: Score[] = [];
    const scoreLines = text.match(/\-\s+\*\*([^*]+)\*\*\s*:\s*(\d+)\/10\s*(?:\-\s*([^\n]+))?/g);
    if (scoreLines) {
      scoreLines.forEach((line) => {
        const match = line.match(/\-\s+\*\*([^*]+)\*\*\s*:\s*(\d+)\/10\s*(?:\-\s*([^\n]+))?/);
        if (match) {
          tempScores.push({
            label: match[1].trim(),
            value: parseInt(match[2]),
            justification: match[3] ? match[3].trim() : "No evaluation provided.",
          });
        }
      });
    }
    setScores(tempScores);

    // Helper to extract items from numbered lists
    const extractListPoints = (sectionHeader: string, nextSectionHeader: string): RoastPoint[] => {
      const escapedHeader = sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const escapedNextHeader = nextSectionHeader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      
      const regex = new RegExp(`${escapedHeader}([\\s\\S]*?)${escapedNextHeader}`, "i");
      const sectionMatch = text.match(regex);
      
      if (!sectionMatch) return [];
      
      const sectionText = sectionMatch[1];
      const points: RoastPoint[] = [];
      const lines = sectionText.split("\n");
      
      lines.forEach((line) => {
        const itemMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*[:\s]*(.*)/);
        if (itemMatch) {
          points.push({
            title: itemMatch[1].trim(),
            detail: itemMatch[2].trim(),
          });
        }
      });
      
      return points;
    };

    // 4. Parse Where Investors Will Pass Immediately
    const fails = extractListPoints("## Where Investors Will Pass Immediately", "## Friction Points and Operational Hurdles");
    setFailureModes(fails);

    // 5. Parse Friction Points and Operational Hurdles
    const frictions = extractListPoints("## Friction Points and Operational Hurdles", "## Final Verdict");
    setFrictionPoints(frictions);

    // 6. Parse Final Verdict and Rationale
    const verdictMatch = text.match(/## Final Verdict\s*\n+([A-Z\-]+)/i);
    setFinalVerdict(verdictMatch ? verdictMatch[1].trim().toUpperCase() : "");

    const rationaleMatch = text.match(/## Verdict Rationale\s*\n+([\s\S]*?)(?:\n+##|$)/i);
    setVerdictRationale(rationaleMatch ? rationaleMatch[1].trim() : "");

    // 7. Parse Fastest Viable V1 and 7-Day Test
    const v1Match = text.match(/## Fastest Viable V1\s*\n+([\s\S]*?)(?:\n+##|$)/i);
    setFastestV1(v1Match ? v1Match[1].trim() : "");

    const validationMatch = text.match(/## 7-Day Validation Test\s*\n+([\s\S]*?)(?:\n+##|$)/i);
    setValidationTest(validationMatch ? validationMatch[1].trim() : "");
  };

  const handleAnalyze = async () => {
    if (!pitch.trim() || loading) return;
    setLoading(true);
    setErr(null);
    setPitchTitle("");
    setFormulation(null);
    setScores([]);
    setFailureModes([]);
    setFrictionPoints([]);
    setFinalVerdict("");
    setVerdictRationale("");
    setFastestV1("");
    setValidationTest("");
    setRawText("");

    try {
      const response = await fetch("/api/pitch-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze pitch.");
      }

      const data = await response.json();
      parseResult(data.text);
    } catch (e: any) {
      setErr(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setRawText("");
    setPitch("");
    setPitchTitle("");
    setFormulation(null);
    setScores([]);
    setFailureModes([]);
    setFrictionPoints([]);
    setFinalVerdict("");
    setVerdictRationale("");
    setFastestV1("");
    setValidationTest("");
  };

  useEffect(() => {
    if (rawText && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [rawText]);

  // Verdict design themes
  let verdictThemeClass = "bg-slate-50 text-slate-700 border-slate-200";
  if (finalVerdict === "GO") {
    verdictThemeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (finalVerdict === "EXPLORE") {
    verdictThemeClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (finalVerdict === "NO-GO") {
    verdictThemeClass = "bg-rose-50 text-rose-700 border-rose-200";
  }

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
              Founder-Operator &amp; Angel Investor
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-none text-slate-900">
            Pitch Analyzer &amp;
            <br />
            <span className="text-teal-accent">Logic Stress Tester.</span>
          </h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-lg">
            A brutal investor-readiness scan. Paste your slide details or concept outline to test for problem urgency, time-to-value, and defensibility, ending with a hard GO or NO-GO decision.
          </p>
        </div>

        {/* Input area */}
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter your pitch outline or slide details:
            </label>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Paste your slide bullets or outline here. E.g.:&#10;Slide 1: Problem: Solar installers waste 10 hours a week on paper permits.&#10;Slide 2: GTM: We will do outbound emails..."
              rows={8}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all resize-y leading-relaxed"
            />
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
                  onClick={() => setPitch(ex.text)}
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
            onClick={handleAnalyze}
            disabled={!pitch.trim() || loading}
            className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
              loading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : pitch.trim()
                ? "btn-primary shadow-sm active:scale-[0.99]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            {loading ? "Analyzing pitch logic..." : "Analyze Pitch & Stress-Test &rarr;"}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-3 justify-center py-4 bg-slate-light rounded-xl border border-slate-200 animate-pulse">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-teal-accent rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Stress-testing logic on 7 distinct criteria...
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

            {/* Pitch Title and Verdict */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">
                    evaluation results
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                    {pitchTitle}
                  </h2>
                </div>
                {finalVerdict && (
                  <div className={`px-4 py-2 border rounded-full text-xs font-mono font-bold tracking-widest text-center ${verdictThemeClass}`}>
                    VERDICT: {finalVerdict}
                  </div>
                )}
              </div>
              
              {verdictRationale && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Verdict Rationale
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {verdictRationale}
                  </p>
                </div>
              )}
            </div>

            {/* Normalized Formulation */}
            {formulation && (
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Normalized Formulation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-light border border-slate-200 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Problem</span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">{formulation.problem}</p>
                  </div>
                  <div className="p-4 bg-slate-light border border-slate-200 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Target User</span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">{formulation.targetUser}</p>
                  </div>
                  <div className="p-4 bg-slate-light border border-slate-200 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Trigger Moment</span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">{formulation.triggerMoment}</p>
                  </div>
                  <div className="p-4 bg-slate-light border border-slate-200 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Proposed Solution</span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">{formulation.proposedSolution}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scorecard section */}
            {scores.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
                  7-Dimension Scorecard
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {scores.map((score, index) => {
                    const isWeak = score.value < 6;
                    const barColor = isWeak ? "#e11d48" : "#2563eb"; // Rose for weak, Royal Blue for strong
                    return (
                      <div
                        key={index}
                        className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm"
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-slate-900">{score.label}</span>
                          <span className="text-sm font-bold font-mono" style={{ color: barColor }}>
                            {score.value}/10
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score.value * 10}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans pl-2 border-l border-slate-200 italic">
                          &ldquo;{score.justification}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Where Investors Will Pass Immediately */}
            {failureModes.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-[3px] w-full bg-rose-600" />
                <div className="p-6 md:p-8 space-y-4">
                  <span className="inline-block px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-rose-50 text-rose-600">
                    Skeptic Objections
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Where Investors Will Pass Immediately
                  </h3>
                  <div className="space-y-4 pt-2">
                    {failureModes.map((point, index) => (
                      <div key={index} className="text-sm leading-relaxed">
                        <strong className="text-rose-600 block sm:inline font-bold mr-1">
                          {point.title}:
                        </strong>
                        <span className="text-slate-600">{point.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Friction Points & Operational Hurdles */}
            {frictionPoints.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-[3px] w-full bg-slate-700" />
                <div className="p-6 md:p-8 space-y-4">
                  <span className="inline-block px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-slate-100 text-slate-700">
                    Execution Hazards
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Friction Points &amp; Operational Hurdles
                  </h3>
                  <div className="space-y-4 pt-2">
                    {frictionPoints.map((point, index) => (
                      <div key={index} className="text-sm leading-relaxed">
                        <strong className="text-slate-800 block sm:inline font-bold mr-1">
                          {point.title}:
                        </strong>
                        <span className="text-slate-600">{point.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Strategy (V1 and 7-day test) */}
            {(fastestV1 || validationTest) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fastestV1 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600">
                      Fastest Viable V1
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {fastestV1}
                    </p>
                  </div>
                )}
                {validationTest && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-teal-accent">
                      7-Day Validation Test
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {validationTest}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reset button */}
            <button
              onClick={resetAll}
              className="w-full py-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Test Another Proposal
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
