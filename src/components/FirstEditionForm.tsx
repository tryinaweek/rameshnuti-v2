"use client";

import Link from "next/link";
import { useId, useState } from "react";

/**
 * Launch Circle signup for The Vibe Coder's OS.
 *
 * Its own form, not NewsletterForm, because /api/waitlist does more than
 * subscribe: it tells us whether the visitor claimed one of the advance reader
 * copies. It still ends in Substack: the route subscribes the address after the
 * waitlist insert.
 *
 * `remaining` is the live advance-copy count from the server, or null when it
 * could not be read. With showCounter, null hides the counter entirely rather
 * than showing a fixed number, and 0 switches the button and the counter line
 * to the "launch list" wording.
 *
 * After a successful signup, an optional "What are you trying to build?"
 * question is offered. It is a separate submission to /api/book-idea that
 * saves the answer on the sign-up record, and it never blocks or re-runs the
 * subscription.
 */
export function FirstEditionForm({
  remaining,
  limit,
  showCounter = false,
}: {
  remaining: number | null;
  limit: number;
  showCounter?: boolean;
}) {
  const emailId = useId();
  const ideaId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [already, setAlready] = useState(false);
  const [error, setError] = useState("");

  const [idea, setIdea] = useState("");
  const [ideaStatus, setIdeaStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const soldOut = remaining === 0;
  const buttonLabel = soldOut ? "Join the launch list" : "Join the Launch Circle";
  const counterLine =
    remaining === null
      ? null
      : soldOut
        ? "The advance copies are taken. Join the list and be first to know on launch day."
        : `${remaining} of ${limit} advance copies left.`;

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
            {already ? "You're already in." : "You're in."}
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Thank you for joining the Launch Circle. I&apos;ll be in touch before launch
            day.
          </p>
        </div>

        {ideaStatus === "sent" ? (
          <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
            Thank you. Got it.
          </p>
        ) : (
          <form onSubmit={sendIdea} className="space-y-2.5 border-t border-slate-100 pt-4">
            <label htmlFor={ideaId} className="block text-sm font-semibold text-slate-800">
              What are you trying to build?
            </label>
            <textarea
              id={ideaId}
              rows={3}
              maxLength={2000}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="premium-input w-full resize-y px-4 py-3 text-sm"
            />
            {ideaStatus === "error" && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                Couldn&apos;t send that just now. You&apos;re already in the Launch Circle.
              </p>
            )}
            <button
              type="submit"
              disabled={ideaStatus === "sending" || !idea.trim()}
              className="btn-primary px-5 py-2.5 text-xs disabled:opacity-50"
            >
              {ideaStatus === "sending" ? "Sending..." : "Send"}
            </button>
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
        {status === "sending" ? "Adding you..." : buttonLabel}
      </button>

      {showCounter && counterLine && (
        <p className="text-xs font-semibold leading-relaxed text-teal-accent">{counterLine}</p>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">
        Launch news about The Vibe Coder&apos;s OS. Unsubscribe anytime.{" "}
        <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
