"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Brand palette (Cohesive with Homepage)
const BG_SLATE = "#F8FAFC";
const BORDER_SLATE = "#E2E8F0";
const TEXT_CHARCOAL = "#0F172A";
const TEXT_MUTED = "#475569";
const TEXT_LIGHT = "#64748B";

const ROYAL_BLUE = "#2563eb";
const BRAND_NAVY = "#0B1329";
const BRAND_CYAN = "#38BDF8";

// ---- Fixed assumptions (sourced May 2026, pre-pricing) ----
// SpaceX trailing revenue ~ $15B (2025). IPO implied multiple reported at ~110x.
const TRAILING_REVENUE = 15e9; // $15B FY2025, per reporting
const SP500_CAGR = 0.1; // long-run nominal total return assumption

// Reference: a $1.75T valuation paired with the ~$653 Forge secondary price
// locks a share count, held constant so any valuation maps to a consistent price.
const REF_VALUATION = 1.75e12;
const REF_PRICE = 653;
const IMPLIED_SHARES = REF_VALUATION / REF_PRICE; // ~2.68B shares, held constant

// ---- Types ----
interface PresetValues {
  valuationT: number;
  dayOnePremium: number;
  revGrowth: number;
  exitMultiple: number;
  holding: number;
  fillRate: number;
}
interface Preset {
  label: string;
  desc: string;
  v: PresetValues;
}
interface ProjectionRow {
  yr: number;
  multAtYr: number;
  priceAtYr: number;
  positionValue: number;
  sp500Value: number;
  cagr: number;
}
interface CurvePoint {
  yrs: number;
  spacex: number;
  sp500: number;
}

function fmtMoney(n: number): string {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function fmtDollars(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const PRESETS: Record<string, Preset> = {
  bull: {
    label: "Bull case",
    desc: "Everything goes right. SpaceX grows fast and the market keeps paying a premium multiple.",
    v: { valuationT: 2.0, dayOnePremium: 35, revGrowth: 50, exitMultiple: 70, holding: 5, fillRate: 60 },
  },
  compress: {
    label: "Multiple compresses",
    desc: "The lesson. SpaceX grows well, but the 110x multiple drifts toward something more normal.",
    v: { valuationT: 1.75, dayOnePremium: 25, revGrowth: 35, exitMultiple: 25, holding: 5, fillRate: 40 },
  },
  reality: {
    label: "Reality check",
    desc: "Strong company, mega-cap multiple. The market eventually prices SpaceX like Nvidia or Apple.",
    v: { valuationT: 1.75, dayOnePremium: 10, revGrowth: 30, exitMultiple: 12, holding: 5, fillRate: 40 },
  },
  shutout: {
    label: "Shut out of allocation",
    desc: "You request shares but get nothing at the IPO price. All of it buys on the open at the pop.",
    v: { valuationT: 1.75, dayOnePremium: 30, revGrowth: 35, exitMultiple: 25, holding: 5, fillRate: 0 },
  },
};

export default function Simulator() {
  const [investment, setInvestment] = useState<number>(5000);
  const [valuationT, setValuationT] = useState<number>(1.75);
  const [dayOnePremium, setDayOnePremium] = useState<number>(25);
  const [revGrowth, setRevGrowth] = useState<number>(35);
  const [exitMultiple, setExitMultiple] = useState<number>(25);
  const [holding, setHolding] = useState<number>(5);
  const [fillRate, setFillRate] = useState<number>(40);
  const [activePreset, setActivePreset] = useState<string | null>("compress");

  function applyPreset(key: string) {
    const p = PRESETS[key].v;
    setValuationT(p.valuationT);
    setDayOnePremium(p.dayOnePremium);
    setRevGrowth(p.revGrowth);
    setExitMultiple(p.exitMultiple);
    setHolding(p.holding);
    setFillRate(p.fillRate);
    setActivePreset(key);
  }

  // Wrap a setter so manual edits clear the active preset highlight.
  const edit =
    (setter: (val: number) => void) =>
    (val: number) => {
      setter(val);
      setActivePreset(null);
    };

  const model = useMemo(() => {
    const INV = investment > 0 ? investment : 0;
    const valuation = valuationT * 1e12;
    const ipoPrice = valuation / IMPLIED_SHARES;
    const dayOnePrice = ipoPrice * (1 + dayOnePremium / 100);
    const startMultiple = valuation / TRAILING_REVENUE; // ~110x at $1.75T

    // Fill model: request INV dollars at the IPO price; fillRate fraction is
    // allocated there, the remainder buys on the open at the day-one price.
    const filledDollars = INV * (fillRate / 100);
    const unfilledDollars = INV - filledDollars;
    const sharesFromIPO = ipoPrice > 0 ? filledDollars / ipoPrice : 0;
    const sharesFromOpen = dayOnePrice > 0 ? unfilledDollars / dayOnePrice : 0;
    const shares = sharesFromIPO + sharesFromOpen;
    const costBasis = INV;
    const blendedPrice = shares > 0 ? INV / shares : 0;

    // Value of the position at a point in time (years from listing). Annual
    // model evaluated continuously: revenue compounds, multiple glides linearly.
    function valueAt(years: number) {
      const revAt = TRAILING_REVENUE * Math.pow(1 + revGrowth / 100, years);
      const t = Math.min(years / holding, 1);
      const multAt = startMultiple + (exitMultiple - startMultiple) * t;
      const priceAt = (revAt * multAt) / IMPLIED_SHARES;
      return {
        spacex: shares * priceAt,
        sp500: INV * Math.pow(1 + SP500_CAGR, years),
        multAt,
        priceAt,
      };
    }

    // Snapshot table: only year marks within the holding period.
    const marks = [1, 3, 5].filter((y) => y <= holding);
    if (!marks.includes(holding)) marks.push(holding);
    const rows: ProjectionRow[] = marks
      .sort((a, b) => a - b)
      .map((yr) => {
        const v = valueAt(yr);
        return {
          yr,
          multAtYr: v.multAt,
          priceAtYr: v.priceAt,
          positionValue: v.spacex,
          sp500Value: v.sp500,
          cagr: INV > 0 ? Math.pow(v.spacex / INV, 1 / yr) - 1 : 0,
        };
      });

    // Continuous curve for the chart: monthly steps across the holding period.
    const curve: CurvePoint[] = [];
    const steps = Math.max(2, Math.round(holding * 12));
    for (let i = 0; i <= steps; i++) {
      const yrs = (holding * i) / steps;
      const v = valueAt(yrs);
      curve.push({ yrs, spacex: v.spacex, sp500: v.sp500 });
    }

    return {
      valuation,
      ipoPrice,
      dayOnePrice,
      blendedPrice,
      startMultiple,
      shares,
      costBasis,
      filledDollars,
      unfilledDollars,
      rows,
      curve,
      INV,
    };
  }, [investment, valuationT, dayOnePremium, revGrowth, exitMultiple, holding, fillRate]);

  const endRow = model.rows[model.rows.length - 1];
  const beatsSP = endRow.positionValue > endRow.sp500Value;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", fontFamily: "var(--font-dm-sans), Georgia, serif", color: TEXT_CHARCOAL }}>
      <style>{
        "input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:#E2E8F0;outline:none;}" +
        `input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:${ROYAL_BLUE};cursor:pointer;border:3px solid #FFFFFF;box-shadow: 0 1px 3px rgba(0,0,0,0.15);}` +
        `input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${ROYAL_BLUE};cursor:pointer;border:3px solid #FFFFFF;box-shadow: 0 1px 3px rgba(0,0,0,0.15);}`
      }</style>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 64px" }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/tools"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 700,
              color: TEXT_LIGHT,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
            className="hover:text-slate-900 transition-colors"
          >
            &larr; Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div style={{ background: BG_SLATE, border: `1px solid ${BORDER_SLATE}`, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: 2, color: ROYAL_BLUE, textTransform: "uppercase", fontWeight: 700 }}>
            Scenario Model · Not a Prediction
          </div>
          <h1 style={{ margin: "8px 0 6px", fontSize: 30, lineHeight: 1.15, fontWeight: 700 }}>
            SpaceX IPO Investment Simulator
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_MUTED, maxWidth: 620 }}>
            Model any investment amount. SpaceX filed its S-1 on May 20, 2026 (ticker SPCX,
            targeting a June 12 Nasdaq debut), but per-share pricing has not been disclosed. Every output
            below is a function of assumptions you set. This is a teaching tool, not financial advice.
          </p>
        </div>

        {/* Reality-check banner */}
        <div style={{ background: BG_SLATE, border: `1px solid ${BORDER_SLATE}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: ROYAL_BLUE, fontWeight: 700, marginBottom: 4 }}>
            THE NUMBER THAT MATTERS MOST
          </div>
          <div style={{ fontSize: 14, color: TEXT_MUTED }}>
            At your selected {valuationT.toFixed(2)}T valuation, SpaceX would IPO at roughly{" "}
            <strong style={{ color: TEXT_CHARCOAL }}>{model.startMultiple.toFixed(0)}x trailing revenue</strong>{" "}
            (~$15B FY2025). For comparison, Tesla IPO&apos;d around 11x. A multiple this high means the bull
            case is largely priced in already. Your return depends less on SpaceX growing and more on
            whether the multiple holds. The exit-multiple slider below is where you stress-test that.
          </div>
        </div>

        {/* Investment amount */}
        <div style={{ background: BG_SLATE, border: `1px solid ${BORDER_SLATE}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: ROYAL_BLUE, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Amount you invest
            </div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
              Type any figure. All outputs below scale to it.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: TEXT_LIGHT }}>$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={investment}
              onChange={(e) => edit(setInvestment)(Math.max(0, parseFloat(e.target.value) || 0))}
              style={{
                width: 140, fontSize: 24, fontWeight: 700, padding: "6px 10px",
                background: "#FFFFFF", color: TEXT_CHARCOAL, border: "1px solid #CBD5E1",
                borderRadius: 8, fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1000, 5000, 10000, 25000].map((amt) => (
              <button
                key={amt}
                onClick={() => edit(setInvestment)(amt)}
                style={{
                  padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12,
                  border: `1px solid ${investment === amt ? ROYAL_BLUE : BORDER_SLATE}`,
                  background: investment === amt ? "rgba(37,99,235,0.08)" : "#FFFFFF",
                  color: investment === amt ? ROYAL_BLUE : TEXT_MUTED,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: TEXT_LIGHT, marginBottom: 8, letterSpacing: 1 }}>
            START HERE · TAP A SCENARIO
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {Object.entries(PRESETS).map(([key, p]) => {
              const on = activePreset === key;
              const tone = ROYAL_BLUE;
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  style={{
                    textAlign: "left", padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${on ? tone : BORDER_SLATE}`,
                    background: on ? "rgba(37,99,235,0.04)" : BG_SLATE, color: TEXT_CHARCOAL,
                    fontFamily: "var(--font-dm-sans), Georgia, serif",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: on ? tone : TEXT_CHARCOAL }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <Panel title="IPO allocation fill rate" accent={ROYAL_BLUE}>
            <Slider
              value={fillRate}
              min={0}
              max={100}
              step={5}
              onChange={edit(setFillRate)}
              display={`${fillRate}% of your order filled at IPO price`}
              anchors={["0% · shut out", "100% · fully filled"]}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              SpaceX is selling up to 30% of the IPO to retail via Schwab, Fidelity, Robinhood and others,
              at the same price as institutions. But demand is expected to far exceed supply, so you
              likely get only part of what you request. The unfilled portion is bought on the open at the
              day-one price. 100% = fully filled at IPO price. 0% = shut out, all bought on the open.
            </p>
          </Panel>

          <Panel title="IPO valuation" accent={ROYAL_BLUE}>
            <Slider
              value={valuationT}
              min={1.5}
              max={2.4}
              step={0.05}
              onChange={edit(setValuationT)}
              display={`$${valuationT.toFixed(2)} trillion`}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              Reported target band: $1.75T-$2.0T. Crypto-derivative pricing implies ~$2.4T (speculative).
            </p>
          </Panel>

          <Panel title="Day-one pop" accent={ROYAL_BLUE}>
            <Slider
              value={dayOnePremium}
              min={-15}
              max={75}
              step={5}
              onChange={edit(setDayOnePremium)}
              display={`${dayOnePremium > 0 ? "+" : ""}${dayOnePremium}%`}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              How far the open trades above the IPO price. This is the price your unfilled shares cost.
              SpaceX is rumored to float only ~5% of the company; a float that thin plus 110x revenue can
              swing hard in either direction on day one. Can be negative.
            </p>
          </Panel>

          <Panel title="Revenue growth (CAGR)" accent={ROYAL_BLUE}>
            <Slider
              value={revGrowth}
              min={5}
              max={60}
              step={5}
              onChange={edit(setRevGrowth)}
              display={`${revGrowth}% / year`}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              Reporting suggests revenue near $15B (2025) growing toward $22-24B in 2026. ~50% is an
              aggressive but cited near-term figure; it will not hold forever.
            </p>
          </Panel>

          <Panel title="Exit multiple (P/S at end of hold)" accent={ROYAL_BLUE}>
            <Slider
              value={exitMultiple}
              min={8}
              max={120}
              step={2}
              onChange={edit(setExitMultiple)}
              display={`${exitMultiple}x revenue`}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              The honest variable. Starts at ~{model.startMultiple.toFixed(0)}x and glides to this over
              your holding period. Mature mega-caps trade at 5-15x. Holding 110x is the real bet.
            </p>
          </Panel>

          <Panel title="Holding period" accent={ROYAL_BLUE}>
            <Slider
              value={holding}
              min={1}
              max={5}
              step={1}
              onChange={edit(setHolding)}
              display={`${holding} year${holding > 1 ? "s" : ""}`}
            />
            <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "8px 0 0" }}>
              The multiple glide completes at the end of this period. The chart traces the whole path;
              the table shows year marks within it.
            </p>
          </Panel>
        </div>

        {/* Position summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          <Stat label="Implied IPO price" value={fmtDollars(model.ipoPrice)} sub={`day-one open ~${fmtDollars(model.dayOnePrice)}`} />
          <Stat
            label="Blended cost per share"
            value={fmtDollars(model.blendedPrice)}
            sub={`${fmtMoney(model.filledDollars)} at IPO + ${fmtMoney(model.unfilledDollars)} on open`}
          />
          <Stat label="Shares acquired" value={model.shares.toFixed(2)} sub={`cost basis ${fmtDollars(model.costBasis)}`} />
        </div>

        {/* End-of-hold headline */}
        <div style={{ background: beatsSP ? "#EFF6FF" : BG_SLATE, border: `1px solid ${beatsSP ? "#BFDBFE" : BORDER_SLATE}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: TEXT_MUTED, letterSpacing: 1 }}>
            YEAR {endRow.yr} OUTCOME · {fmtMoney(model.INV)} INVESTED
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 14, marginTop: 6 }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: TEXT_CHARCOAL }}>{fmtDollars(endRow.positionValue)}</span>
            <span style={{ fontSize: 15, color: beatsSP ? ROYAL_BLUE : TEXT_MUTED, fontWeight: 700 }}>
              {beatsSP ? "beats" : "trails"} an S&amp;P 500 index fund ({fmtDollars(endRow.sp500Value)}) by{" "}
              {fmtDollars(Math.abs(endRow.positionValue - endRow.sp500Value))}
            </span>
          </div>
        </div>

        {/* Projection chart */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER_SLATE}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 4px", fontFamily: "var(--font-jetbrains-mono), monospace", color: ROYAL_BLUE }}>
            VALUE OVER TIME
          </h2>
          <p style={{ fontSize: 11, color: TEXT_LIGHT, margin: "0 0 14px" }}>
            A continuous projection from an annual growth-and-multiple model. It shows the shape of the
            path, not week-to-week price action. The real first weeks of a thin-float IPO are far more
            volatile than any smooth line can show.
          </p>
          <ProjectionChart curve={model.curve} holding={holding} />
        </div>

        {/* Projection table */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER_SLATE}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 14px", fontFamily: "var(--font-jetbrains-mono), monospace", color: ROYAL_BLUE }}>
            PROJECTED VALUE OF {fmtMoney(model.INV)}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ color: TEXT_MUTED, textAlign: "right", fontSize: 12 }}>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Year</th>
                  <th style={{ padding: "6px 8px" }}>Implied mult.</th>
                  <th style={{ padding: "6px 8px" }}>Share price</th>
                  <th style={{ padding: "6px 8px" }}>Position value</th>
                  <th style={{ padding: "6px 8px" }}>Your CAGR</th>
                  <th style={{ padding: "6px 8px" }}>S&amp;P 500 @ 10%</th>
                  <th style={{ padding: "6px 8px" }}>vs. S&amp;P</th>
                </tr>
              </thead>
              <tbody>
                {model.rows.map((r) => {
                  const diff = r.positionValue - r.sp500Value;
                  return (
                    <tr key={r.yr} style={{ borderTop: `1px solid ${BORDER_SLATE}`, textAlign: "right" }}>
                      <td style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700 }}>Year {r.yr}</td>
                      <td style={{ padding: "10px 8px", color: TEXT_MUTED }}>{r.multAtYr.toFixed(0)}x</td>
                      <td style={{ padding: "10px 8px", color: TEXT_MUTED }}>{fmtDollars(r.priceAtYr)}</td>
                      <td style={{ padding: "10px 8px", fontWeight: 700, color: TEXT_CHARCOAL }}>{fmtDollars(r.positionValue)}</td>
                      <td style={{ padding: "10px 8px", color: r.cagr >= 0 ? ROYAL_BLUE : TEXT_MUTED, fontWeight: 700 }}>
                        {(r.cagr * 100).toFixed(0)}%
                      </td>
                      <td style={{ padding: "10px 8px", color: TEXT_LIGHT }}>{fmtDollars(r.sp500Value)}</td>
                      <td style={{ padding: "10px 8px", fontWeight: 700, color: diff >= 0 ? ROYAL_BLUE : TEXT_MUTED }}>
                        {diff >= 0 ? "+" : ""}
                        {fmtDollars(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ background: beatsSP ? "#EFF6FF" : BG_SLATE, border: `1px solid ${beatsSP ? "#BFDBFE" : BORDER_SLATE}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: TEXT_CHARCOAL }}>
            <strong>
              At year {endRow.yr}, this scenario {beatsSP ? "beats" : "trails"} the S&amp;P 500 by{" "}
              {fmtDollars(Math.abs(endRow.positionValue - endRow.sp500Value))}.
            </strong>{" "}
            {beatsSP
              ? `That outperformance requires SpaceX to grow revenue ${revGrowth}%/yr AND the market to still pay ${exitMultiple}x revenue at the end. Drag the exit multiple toward 10-15x, where mature mega-caps actually trade, and watch what happens.`
              : "Even cutting the multiple modestly erases the SpaceX edge. This is the central risk: at a ~110x entry multiple, you can be right about the rockets and still lose to an index fund."}
          </div>
        </div>

        {/* Honest footer */}
        <div style={{ fontSize: 12, color: TEXT_LIGHT, lineHeight: 1.6 }}>
          <strong style={{ color: TEXT_MUTED }}>Assumptions and limits.</strong> Share count (~2.68B) is
          derived from a $1.75T valuation paired with a ~$653 reference price and held fixed, so valuation
          and IPO price stay consistent; SpaceX&apos;s actual count, dual-class structure, and ~5% float are
          not finalized. Revenue is modeled from ~$15B FY2025. The fill-rate slider splits your investment
          between the IPO price (the allocated portion) and the day-one open (the unfilled remainder);
          real allocations depend on your broker and total demand. The multiple glides linearly to your
          exit input. The S&amp;P 500 line uses a flat 10% nominal assumption. This model ignores lock-up
          expirations, taxes, and the real possibility of permanent loss. It is a tool for understanding
          valuation mechanics, not a forecast and not investment advice. Figures sourced from public
          reporting as of May 24, 2026.
        </div>
      </div>
    </div>
  );
}

function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG_SLATE, border: `1px solid ${BORDER_SLATE}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  display,
  anchors,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  display: string;
  anchors?: [string, string];
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 18, fontWeight: 700, color: TEXT_CHARCOAL, marginBottom: 8 }}>
        {display}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
      {anchors && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: TEXT_LIGHT, fontFamily: "var(--font-jetbrains-mono), monospace" }}>{anchors[0]}</span>
          <span style={{ fontSize: 10, color: TEXT_LIGHT, fontFamily: "var(--font-jetbrains-mono), monospace" }}>{anchors[1]}</span>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: BG_SLATE, border: `1px solid ${BORDER_SLATE}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_CHARCOAL, margin: "4px 0 2px" }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_LIGHT }}>{sub}</div>
    </div>
  );
}

function ProjectionChart({ curve, holding }: { curve: CurvePoint[]; holding: number }) {
  const W = 640,
    H = 260,
    padL = 56,
    padR = 16,
    padT = 14,
    padB = 30;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;

  const maxV = Math.max(...curve.map((p) => Math.max(p.spacex, p.sp500)), 1);
  const x = (yrs: number) => padL + (yrs / holding) * plotW;
  const y = (v: number) => padT + plotH - (v / maxV) * plotH;

  const path = (key: "spacex" | "sp500") =>
    curve.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.yrs).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");

  const yTicks = 4;
  const last = curve[curve.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const v = (maxV * i) / yTicks;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke={BORDER_SLATE} strokeWidth="1" />
            <text x={padL - 8} y={yy + 3} fill={TEXT_LIGHT} fontSize="10" textAnchor="end" fontFamily="monospace">
              {v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "k"}
            </text>
          </g>
        );
      })}
      {Array.from({ length: holding + 1 }, (_, i) => (
        <text key={i} x={x(i)} y={H - 10} fill={TEXT_LIGHT} fontSize="10" textAnchor="middle" fontFamily="monospace">
          {i === 0 ? "IPO" : i + "y"}
        </text>
      ))}
      <path d={path("sp500")} fill="none" stroke={TEXT_LIGHT} strokeWidth="2" strokeDasharray="5 4" />
      <path d={path("spacex")} fill="none" stroke={ROYAL_BLUE} strokeWidth="2.5" />
      <circle cx={x(last.yrs)} cy={y(last.spacex)} r="4" fill={ROYAL_BLUE} />
      <circle cx={x(last.yrs)} cy={y(last.sp500)} r="4" fill={TEXT_LIGHT} />
      <g>
        <line x1={padL} y1={padT + 4} x2={padL + 22} y2={padT + 4} stroke={ROYAL_BLUE} strokeWidth="2.5" />
        <text x={padL + 28} y={padT + 7} fill={TEXT_MUTED} fontSize="11" fontFamily="monospace">
          SpaceX position
        </text>
        <line x1={padL + 150} y1={padT + 4} x2={padL + 172} y2={padT + 4} stroke={TEXT_LIGHT} strokeWidth="2" strokeDasharray="5 4" />
        <text x={padL + 178} y={padT + 7} fill={TEXT_MUTED} fontSize="11" fontFamily="monospace">
          S&amp;P 500
        </text>
      </g>
    </svg>
  );
}
