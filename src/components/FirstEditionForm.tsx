"use client";

import Link from "next/link";
import { useId, useState } from "react";

/**
 * Vibe Coding OS launch waitlist signup.
 *
 * Deliberately not the NewsletterForm: that one hands the visitor off to
 * Substack. This joins the waitlist in THE LIST via /api/waitlist, which
 * returns the visitor's real position and whether they claimed one of the
 * advance reader copies.
 *
 * After a successful signup, an optional "what would you build?" question is
 * offered. It's a separate, skippable submission to /api/book-idea and never
 * blocks or re-runs the subscription.
 */
export function FirstEditionForm() {
  const emailId = useId();
  const ideaId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [already, setAlready] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [arc, setArc] = useState(false);
  const [error, setError] = useState("");

  const [idea, setIdea] = useState("");
  const [ideaStatus, setIdeaStatus] = useState<
    "idle" | "sending" | "sent" | "skipped" | "error"
  >("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setStatus("idle");
        return;
      }
      setAlready(Boolean(data.already));
      setPosition(typeof data.position === "number" ? data.position : null);
      setArc(Boolean(data.arc));
      setStatus("done");
    } catch {
      setError("Network error. Try again in a moment.");
      setStatus("idle");
    }
  };

  const sendIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setIdeaStatus("sending");
    try {
      const res = await fetch("/api/book-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, idea }),
      });
      setIdeaStatus(res.ok ? "sent" : "error");
    } catch {
      setIdeaStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="animate-fade-up space-y-4 text-left">
        <div className="space-y-2">
          <p className="text-base font-bold tracking-tight text-slate-900">
            {already
              ? "You're already on the waitlist."
              : position
                ? `You're #${position} on the waitlist.`
                : "You're on the waitlist."}
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {arc
              ? "You're in the first 50, so an advance copy of the book (PDF) is coming your way before launch day."
              : "I'll email you the moment Vibe Coding OS launches."}{" "}
            &mdash; Ramesh
          </p>
        </div>

        {ideaStatus === "sent" ? (
          <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
            Thanks &mdash; I read every one of these.
          </p>
        ) : ideaStatus === "skipped" ? null : (
          <form onSubmit={sendIdea} className="space-y-2.5 border-t border-slate-100 pt-4">
            <label
              htmlFor={ideaId}
              className="block text-sm font-semibold text-slate-800"
            >
              Optional: what is one thing you would love to build?
            </label>
            <textarea
              id={ideaId}
              rows={3}
              maxLength={2000}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="A tool, an experiment, an idea you keep coming back to..."
              className="premium-input w-full resize-y px-4 py-3 text-sm"
            />
            {ideaStatus === "error" && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                Couldn&apos;t send that just now. You can skip it &mdash; you&apos;re
                already on the list.
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={ideaStatus === "sending" || !idea.trim()}
                className="btn-primary px-5 py-2.5 text-xs disabled:opacity-50"
              >
                {ideaStatus === "sending" ? "Sending..." : "Share it"}
              </button>
              <button
                type="button"
                onClick={() => setIdeaStatus("skipped")}
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                Skip
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <div>
        <label
          htmlFor={emailId}
          className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="premium-input w-full px-4 py-3 text-sm"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full px-6 py-3.5 text-sm disabled:opacity-50"
      >
        {status === "sending" ? "Adding you..." : "Join the waitlist"}
      </button>

      <p className="text-[11px] leading-relaxed text-slate-500">
        Launch news about Vibe Coding OS. Unsubscribe anytime.{" "}
        <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
