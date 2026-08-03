"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Header = action bar: logo · Menu · Work with me.
 * All discovery links live in the panel (hamburger at every width, labeled
 * "Menu" — icon-only hamburgers get ignored on desktop). The full sitemap is
 * also in the Footer, which keeps every page one crawlable link from home.
 */
const groups: { heading: string | null; links: { href: string; label: string }[] }[] = [
  {
    heading: null,
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
    ],
  },
  {
    heading: "Lab",
    links: [
      { href: "/lab", label: "The Lab — apps I've shipped" },
      { href: "/tools", label: "Tools — free utilities" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/writing", label: "Writing" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/courses", label: "Courses" },
    ],
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the panel on route change and on Escape.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-8 h-8 rounded-full bg-teal-accent flex items-center justify-center text-white text-[10px] font-bold">
            RN
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-dark font-sans hidden sm:inline">
            Ramesh Nuti
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
              open
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            Menu
          </button>

          <Link
            href="/work-with-me"
            className={`text-xs font-bold tracking-wider uppercase no-underline px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              pathname === "/work-with-me"
                ? "bg-teal-accent text-white"
                : "bg-teal-accent/10 text-teal-accent border border-teal-accent/25 hover:bg-teal-accent hover:text-white"
            }`}
          >
            Work with me
          </Link>
        </div>
      </div>

      {/* Panel — always in the DOM so every link is server-rendered; classes toggle visibility. */}
      <div
        id="site-menu"
        className={`border-t border-slate-100 bg-white overflow-hidden transition-all duration-200 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 grid sm:grid-cols-3 gap-x-8 gap-y-5">
          {groups.map((group, gi) => (
            <div key={gi} className="space-y-1.5">
              {group.heading && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-0.5">
                  {group.heading}
                </p>
              )}
              {group.links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block text-xs font-semibold tracking-wider uppercase no-underline py-1.5 transition-colors ${
                      isActive ? "text-teal-accent" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-5 flex items-center justify-between border-t border-slate-50 pt-4">
          <Link
            href="/work-with-me"
            onClick={() => setOpen(false)}
            className="text-xs font-bold tracking-wider uppercase no-underline px-3.5 py-2 rounded-lg bg-teal-accent text-white"
          >
            Work with me &rarr;
          </Link>
          <a
            href="https://www.linkedin.com/in/rnuti/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-accent p-2 transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
