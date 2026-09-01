"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * First Edition Circle signup.
 *
 * Deliberately not the NewsletterForm: that one hands the visitor off to
 * Substack, which is the wrong destination for a book circle. This writes
 * straight to THE LIST (public.people via /api/subscribe) under its own
 * source tag, so the two audiences stay separable without a second provider.
 */
export function FirstEditionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [already, setAlready] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "vibe-coding-os" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setStatus("idle");
        return;
      }
      setAlready(Boolean(data.alreadySubscribed));
      setStatus("done");
    } catch {
      setError("Network error. Try again in a moment.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="animate-fade-up space-y-2 text-left">
        <p className="text-base font-bold tracking-tight text-slate-900">
          {already ? "You're already on the list." : "You're on the list."}
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          I&apos;ll write when there&apos;s something worth reading: an early chapter, a
          question I&apos;m stuck on, or a decision I want a second opinion about.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <div>
        <label
          htmlFor="circle-email"
          className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Email address
        </label>
        <input
          id="circle-email"
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="premium-input w-full px-4 py-3 text-sm"
        />
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full px-6 py-3.5 text-sm disabled:opacity-50"
      >
        {status === "sending" ? "Adding you..." : "Join the First Edition Circle"}
      </button>

      <p className="text-[11px] leading-relaxed text-slate-500">
        Occasional updates while the book is being written. Unsubscribe anytime.{" "}
        <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
