"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "hero" | "navy" | "standard";
  buttonText?: string;
  placeholder?: string;
  redirectTo?: string;
}

export function NewsletterForm({
  variant = "standard",
  buttonText = "Subscribe",
  placeholder = "Email address",
  redirectTo,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (redirectTo) {
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    }
  };

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
            action="https://startupvalue.substack.com/subscribe"
            method="GET"
            target="_blank"
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              type="email"
              name="email"
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
          action="https://startupvalue.substack.com/subscribe"
          method="GET"
          target="_blank"
          onSubmit={handleSubmit}
          className="flex gap-2 w-full"
        >
          <input
            type="email"
            name="email"
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
        action="https://startupvalue.substack.com/subscribe"
        method="GET"
        target="_blank"
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <input
          type="email"
          name="email"
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
