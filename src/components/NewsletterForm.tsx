"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "hero" | "navy" | "standard";
  buttonText?: string;
  placeholder?: string;
  redirectTo?: string;
  /** Where this signup came from, recorded in THE LIST (Supabase people). */
  sourceTag?: string;
}

export function NewsletterForm({
  variant = "standard",
  buttonText = "Subscribe",
  placeholder = "Email address",
  redirectTo,
  sourceTag = "newsletter",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (redirectTo && redirectTo.includes("/workshop/resources")) {
      document.cookie = "unlocked_workshop=true; path=/; max-age=86400";
    }

    // Capture into THE LIST first — the address must survive even if the
    // visitor never completes Substack's confirmation flow. keepalive lets the
    // request finish if the page navigates.
    void fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: sourceTag }),
      keepalive: true,
    }).catch(() => {
      // Never block the subscribe experience on the capture call.
    });

    const substackUrl = `https://startupvalue.substack.com/subscribe?email=${encodeURIComponent(email)}`;

    try {
      window.open(substackUrl, "_blank");
    } catch (err) {
      console.error("Popup blocked:", err);
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const substackUrl = `https://startupvalue.substack.com/subscribe?email=${encodeURIComponent(email)}`;

    if (variant === "hero") {
      return (
        <div className="pt-4 border-t border-slate-100 grid sm:grid-cols-12 gap-4 items-start sm:items-center text-left animate-fade-up">
          <div className="sm:col-span-12 space-y-2">
            <p className="font-bold text-sm text-slate-900">🎉 Check the new tab to subscribe!</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We opened Substack in a new window so you can confirm your free email subscription.
              If it did not open,{" "}
              <a href={substackUrl} target="_blank" rel="noopener noreferrer" className="text-teal-accent hover:underline font-bold">
                click here to complete
              </a>.
              {redirectTo && (
                <>
                  {" "}Or go straight to{" "}
                  <a href={redirectTo} className="text-teal-accent hover:underline font-bold">
                    Workshop Resources &rarr;
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      );
    }

    if (variant === "navy") {
      return (
        <div className="space-y-2 text-left w-full text-white animate-fade-up">
          <p className="font-bold text-sm">🎉 Check the new tab to subscribe!</p>
          <p className="text-xs text-white/70">
            Substack did not open?{" "}
            <a href={substackUrl} target="_blank" rel="noopener noreferrer" className="text-teal-accent hover:underline font-bold">
              Click here to complete
            </a>.
            {redirectTo && (
              <>
                {" "}Or view{" "}
                <a href={redirectTo} className="text-teal-accent hover:underline font-bold">
                  Workshop Resources &rarr;
                </a>
              </>
            )}
          </p>
        </div>
      );
    }

    return (
      <div className="premium-card p-6 text-center space-y-4 max-w-md mx-auto animate-fade-up">
        <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-accent rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <div className="space-y-1">
          <h3 className="text-slate-900 text-base font-bold">Substack Subscription Opened</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            We opened Substack in a new tab so you can confirm your free email subscription.
          </p>
        </div>
        <div className="space-y-2.5 pt-2">
          {redirectTo && (
            <a
              href={redirectTo}
              className="btn-primary block w-full text-center py-2.5 text-xs font-semibold"
            >
              Access Workshop Resources &rarr;
            </a>
          )}
          <p className="text-[10px] text-slate-400">
            Substack page did not open?{" "}
            <a
              href={substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent hover:underline font-semibold"
            >
              Click here to complete signup
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="pt-4 border-t border-slate-100 grid sm:grid-cols-12 gap-4 items-start sm:items-center text-left">
        <div className="sm:col-span-5">
          <p className="font-bold text-sm text-slate-900">Want to join us?</p>
          <p className="text-xs text-slate-500 mt-1">1,000+ builders start their week with a 5-minute email. Free.</p>
        </div>
        <div className="hidden sm:flex sm:col-span-1 justify-center text-teal-accent text-lg">
          &rarr;
        </div>
        <div className="sm:col-span-6 space-y-1">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent/15 transition-all"
            />
            <button
              type="submit"
              className="btn-primary px-5 py-2 text-xs whitespace-nowrap cursor-pointer"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (variant === "navy") {
    return (
      <div className="space-y-1 text-left w-full">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 w-full"
        >
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:bg-white/15 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-brand-navy hover:bg-slate-950 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {buttonText}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="premium-input px-4 py-3 text-sm focus:border-teal-accent transition-colors w-full sm:max-w-xs"
        />
        <button
          type="submit"
          className="btn-primary px-6 py-3 text-sm cursor-pointer"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
