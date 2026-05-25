import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 px-6 bg-slate-light">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <p className="text-xs font-semibold text-slate-dark tracking-wide italic">
          &ldquo;The objection you didn&apos;t prepare for is the one that kills the deal.&rdquo;
        </p>
        
        <div className="flex items-center justify-center gap-2.5 text-[11px] text-slate-500 select-none">
          <div className="w-5 h-5 rounded-full bg-teal-accent flex items-center justify-center text-white text-[7px] font-bold">
            RN
          </div>
          <span className="font-sans">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/rnuti/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent font-bold no-underline hover:underline transition-all duration-300"
            >
              Ramesh Nuti
            </a>
            {" "}&middot;{" "}
            <span className="font-medium text-slate-700">2x founder</span>
            {" "}&middot;{" "}
            <a
              href="https://svyam.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-teal-accent font-bold no-underline transition-all duration-300"
            >
              investor @ Svyam Ventures
            </a>
            {" "}&middot;{" "}
            <span className="text-slate-700 font-medium">vibe coder</span>
          </span>
        </div>

        <div className="pt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 items-center">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1 text-[11px] text-teal-accent font-bold no-underline hover:underline transition-all duration-300"
          >
            Newsletter <span>&rarr;</span>
          </Link>
          <span className="text-[11px] text-slate-200">|</span>
          <Link
            href="/workshop"
            className="inline-flex items-center gap-1 text-[11px] text-teal-accent font-bold no-underline hover:underline transition-all duration-300"
          >
            Free Workshop <span>&rarr;</span>
          </Link>
          <span className="text-[11px] text-slate-200">|</span>
          <a
            href="https://chat.whatsapp.com/D4KNtVUNHQo7ipId4yHSPO?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-teal-accent font-bold no-underline hover:underline transition-all duration-300"
          >
            WhatsApp Community <span>&rarr;</span>
          </a>
          <span className="text-[11px] text-slate-200">|</span>
          <a
            href="https://startupgrind.com/frisco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-teal-accent font-bold no-underline hover:underline transition-all duration-300"
          >
            Startup Grind Frisco <span>&rarr;</span>
          </a>
          <span className="text-[11px] text-slate-200">|</span>
          <Link
            href="/privacy"
            className="text-[11px] text-slate-500 hover:text-teal-accent font-semibold no-underline transition-all duration-300"
          >
            Privacy Policy &amp; Disclaimers
          </Link>
        </div>

        <div className="max-w-2xl mx-auto pt-4 border-t border-slate-200/50">
          <p className="text-[10px] text-slate-400 leading-relaxed text-center font-sans">
            <strong>Disclaimer:</strong> All information, software, and interactive tools on this website are provided &ldquo;as-is&rdquo; for educational and informational purposes only. Nothing here constitutes investment, financial, legal, or professional advice. Ramesh Nuti does not guarantee the accuracy of any simulator outputs and assumes no liability for actions taken, decisions made, or outcomes resulting from your use of this website and its utilities.
          </p>
        </div>

        <p className="text-[10px] text-slate-400 font-mono pt-2">
          &copy; {new Date().getFullYear()} Ramesh Nuti. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
