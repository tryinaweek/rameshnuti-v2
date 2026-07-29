"use client";

import { useState } from "react";

export function AssessmentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [challenge, setChallenge] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/book-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, challenge }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please try again or email ramesh@svyam.co.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="premium-card p-8 text-center space-y-4 animate-fade-up">
        <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-accent rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <div className="space-y-2">
          <h3 className="text-slate-900 text-lg font-bold">Request received!</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Thanks, {name.split(" ")[0]}. I&apos;ll personally reply within 24 hours to
            schedule your free 30-minute workflow assessment.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          In a hurry? Email me directly at{" "}
          <a href="mailto:ramesh@svyam.co" className="text-teal-accent font-semibold hover:underline">
            ramesh@svyam.co
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Your name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Founder"
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="company" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Company / business
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Logistics"
          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="challenge" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          What&apos;s your most time-consuming workflow?
        </label>
        <textarea
          id="challenge"
          rows={4}
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="e.g. We spend hours every week manually copying orders from email into our system..."
          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all resize-y"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full py-3.5 text-sm font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Request My Free Assessment →"}
      </button>
      <p className="text-[11px] text-slate-400 text-center leading-normal">
        No spam, no obligation. I&apos;ll reply personally within 24 hours.
      </p>
    </form>
  );
}
