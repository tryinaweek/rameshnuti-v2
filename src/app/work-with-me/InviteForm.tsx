"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { readFirstTouch } from "@/lib/attribution";

type InviteType = "workshop" | "speaking";

const SELECT_EVENT = "invite:select";
const TYPES: { value: InviteType; label: string }[] = [
  { value: "workshop", label: "Workshop" },
  { value: "speaking", label: "Speaking" },
];
const AUDIENCES = ["Under 25", "25 to 100", "100 to 500", "500+"];

/**
 * One of the "Invite me" buttons on the cards. Picks the matching option in the
 * form, then the #invite link scrolls to it (and still works without JS).
 */
export function InviteButton({ type, label }: { type: InviteType; label: string }) {
  return (
    <a
      href="#invite"
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: type }))}
      className="btn-secondary px-5 py-3 text-sm text-center no-underline"
    >
      {label} &rarr;
    </a>
  );
}

export function InviteForm() {
  const id = useId();
  const sentRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<InviteType>("workshop");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    organization: "",
    when: "",
    location: "",
    audience: "",
    details: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<InviteType>).detail;
      if (detail === "workshop" || detail === "speaking") setType(detail);
    };
    window.addEventListener(SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_EVENT, onSelect);
  }, []);

  // The thank-you is much shorter than the form, so without this the page
  // collapses and leaves the visitor looking at the footer.
  useEffect(() => {
    if (status === "sent") sentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...fields, attribution: readFirstTouch() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again, or email ramesh@svyam.co.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    const first = fields.name.trim().split(/\s+/)[0];
    return (
      <div ref={sentRef} role="status" className="animate-fade-up py-6 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-accent/10 border border-teal-accent/20 text-teal-accent flex items-center justify-center text-xl font-bold">
          ✓
        </div>
        <p className="text-lg font-bold text-slate-900 tracking-tight">
          Thank you{first ? `, ${first}` : ""}.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Your invitation is with me, and I&apos;ll reply personally at {fields.email}.
        </p>
      </div>
    );
  }

  const label = "block mb-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500";
  const input = "premium-input w-full px-4 py-3 text-sm";

  return (
    <form onSubmit={submit} className="space-y-5 text-left">
      <fieldset>
        <legend className={label}>What would you like?</legend>
        <div className="grid grid-cols-2 gap-2.5">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`cursor-pointer rounded-lg border px-4 py-3 text-sm font-semibold text-center transition-colors ${
                type === t.value
                  ? "border-teal-accent bg-teal-accent/10 text-teal-accent"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${id}-name`} className={label}>Your name</label>
          <input id={`${id}-name`} required maxLength={200} autoComplete="name"
            value={fields.name} onChange={set("name")} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input id={`${id}-email`} type="email" required maxLength={320} autoComplete="email"
            value={fields.email} onChange={set("email")} placeholder="you@example.com" className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-org`} className={label}>Organization</label>
          <input id={`${id}-org`} required maxLength={200} autoComplete="organization"
            value={fields.organization} onChange={set("organization")} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-when`} className={label}>
            When <span className="normal-case tracking-normal font-sans font-normal text-slate-400">(optional)</span>
          </label>
          <input id={`${id}-when`} maxLength={200} value={fields.when} onChange={set("when")}
            placeholder="A date, or e.g. early March" className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-where`} className={label}>
            Where <span className="normal-case tracking-normal font-sans font-normal text-slate-400">(optional)</span>
          </label>
          <input id={`${id}-where`} maxLength={200} value={fields.location} onChange={set("location")}
            placeholder="City, or virtual" className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-audience`} className={label}>
            Audience size <span className="normal-case tracking-normal font-sans font-normal text-slate-400">(optional)</span>
          </label>
          <select id={`${id}-audience`} value={fields.audience} onChange={set("audience")} className={input}>
            <option value="">Not sure yet</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-details`} className={label}>About the event</label>
        <textarea id={`${id}-details`} required minLength={10} maxLength={4000} rows={5}
          value={fields.details} onChange={set("details")}
          placeholder="Who will be in the room, and what would you like them to leave with?"
          className={`${input} resize-y`} />
      </div>

      {/* Left empty by people; bots that fill every field get a quiet no-op. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={fields.website} onChange={set("website")} />
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <button type="submit" disabled={status === "sending"}
          className="btn-primary px-7 py-3.5 text-sm disabled:opacity-50">
          {status === "sending" ? "Sending..." : "Send invitation"}
        </button>
        <p className="text-xs text-slate-500 leading-relaxed">
          I read every invitation myself. Details are only used to reply.{" "}
          <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">Privacy</Link>
        </p>
      </div>
    </form>
  );
}
