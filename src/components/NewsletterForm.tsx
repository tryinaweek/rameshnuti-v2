"use client";

import { useId, useState } from "react";

import { substackSubscribeUrl } from "@/lib/newsletter";
import { EMAIL_COOKIE, UNLOCK_MAX_AGE_SECONDS } from "@/lib/workshop-cookies";

/**
 * The one email form on the site. Everything it captures ends up in Substack.
 *
 * On submit it posts to /api/subscribe, which records the address on THE LIST
 * (Supabase, memory only) and then subscribes it to Substack server side.
 * When Substack confirms, the visitor is done. When it can't be confirmed, the
 * visitor gets a one-click link to finish on Substack's own page — never a
 * silent failure, and never an unrequested popup.
 *
 * With `redirectTo` it doubles as a workshop download gate: it sets the unlock
 * and attribution cookies, then offers the files.
 */

interface NewsletterFormProps {
  variant?: "standard" | "navy";
  buttonText?: string;
  placeholder?: string;
  /** Workshop resources page to unlock, e.g. /workshops/<slug>/resources. */
  redirectTo?: string;
  /** Where this signup came from, recorded on THE LIST. */
  sourceTag?: string;
}

type Outcome = "subscribed" | "already" | "confirm" | "saved-elsewhere";

export function NewsletterForm({
  variant = "standard",
  buttonText = "Subscribe",
  placeholder = "Email address",
  redirectTo,
  sourceTag = "newsletter",
}: NewsletterFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [outcome, setOutcome] = useState<Outcome>("subscribed");

  const dark = variant === "navy";

  const unlockWorkshop = (address: string) => {
    const legacyUnlock = Boolean(redirectTo?.includes("/workshop/resources"));
    if (legacyUnlock) {
      document.cookie = `unlocked_workshop=true; path=/; max-age=${UNLOCK_MAX_AGE_SECONDS}`;
    }
    const slugMatch = redirectTo?.match(/^\/workshops\/([a-z0-9-]+)\/resources/);
    if (slugMatch) {
      document.cookie = `unlocked_${slugMatch[1]}=true; path=/; max-age=${UNLOCK_MAX_AGE_SECONDS}`;
    }
    // Lets /api/download record who took each file. Expires with the unlock.
    if (legacyUnlock || slugMatch) {
      document.cookie = `${EMAIL_COOKIE}=${encodeURIComponent(
        address,
      )}; path=/; max-age=${UNLOCK_MAX_AGE_SECONDS}; SameSite=Lax`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim().toLowerCase();
    // The files unlock whatever happens next: the gate is a courtesy, not a paywall.
    unlockWorkshop(address);
    setStatus("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address, source: sourceTag }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOutcome("saved-elsewhere");
      } else if (data.substack !== "synced") {
        setOutcome("confirm");
      } else {
        setOutcome(data.alreadySubscribed ? "already" : "subscribed");
      }
    } catch {
      setOutcome("saved-elsewhere");
    }
    setStatus("done");
  };

  if (status === "done") {
    const heading = {
      subscribed: "You're subscribed.",
      already: "You're already on the list.",
      confirm: "One more step.",
      "saved-elsewhere": "Almost there.",
    }[outcome];

    const body = {
      subscribed: `The next playbook arrives Saturday, from Substack.`,
      already: `Saturday's playbook will keep arriving from Substack.`,
      confirm: `Confirm on Substack and Saturday's playbook will reach you.`,
      "saved-elsewhere": `Something hiccupped on our side. Subscribe directly on Substack instead.`,
    }[outcome];

    const needsSubstackClick = outcome === "confirm" || outcome === "saved-elsewhere";

    return (
      <div className={`space-y-3 text-left animate-fade-up ${dark ? "text-white" : ""}`}>
        <div>
          <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>{heading}</p>
          <p className={`text-xs leading-relaxed mt-1 ${dark ? "text-white/70" : "text-slate-600"}`}>
            {body}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {redirectTo && (
            <a href={redirectTo} className="btn-primary px-5 py-2.5 text-xs text-center no-underline">
              Open the workshop files &rarr;
            </a>
          )}
          {needsSubstackClick && (
            <a
              href={substackSubscribeUrl(email.trim().toLowerCase())}
              target="_blank"
              rel="noopener noreferrer"
              className={
                redirectTo
                  ? `px-5 py-2.5 text-xs font-semibold text-center rounded-lg border no-underline ${
                      dark
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`
                  : "btn-primary px-5 py-2.5 text-xs text-center no-underline"
              }
            >
              Confirm on Substack &rarr;
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    // action/method/name are the fallback for a tap that lands before the page's
    // JavaScript has loaded (slow phones): the browser then submits straight to
    // Substack's own signup page with the address prefilled, instead of
    // reloading this page and dropping it. Once loaded, handleSubmit takes over.
    <form
      onSubmit={handleSubmit}
      action={substackSubscribeUrl()}
      method="get"
      className="flex flex-col sm:flex-row gap-2 w-full"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        maxLength={320}
        className={
          dark
            ? "flex-1 bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:bg-white/15 focus:outline-none transition-all"
            : "premium-input flex-1 px-4 py-3 text-sm"
        }
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className={
          dark
            ? "bg-white text-slate-900 hover:bg-slate-100 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            : "btn-primary px-6 py-3 text-sm whitespace-nowrap disabled:opacity-60"
        }
      >
        {status === "sending" ? "Subscribing..." : buttonText}
      </button>
    </form>
  );
}
