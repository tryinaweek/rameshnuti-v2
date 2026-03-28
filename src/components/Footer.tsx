import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <p className="text-sm font-medium text-foreground">
          The objection you didn&apos;t prepare for is the one that kills the deal.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
          <div className="w-5 h-5 rounded-full bg-[linear-gradient(135deg,#1A1A3E_0%,#4ADE80_100%)] flex items-center justify-center text-white text-[7px] font-bold">
            RN
          </div>
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/rameshnuti/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-mint font-bold no-underline hover:underline"
            >
              Ramesh Nuti
            </a>
            {" "}&middot;{" "}
            <span className="text-terra-400 font-medium">2x founder</span>
            {" "}&middot;{" "}
            <span className="text-terra-400 font-medium">investor</span>
            {" "}&middot;{" "}
            <span className="text-violet-400 font-medium">vibe coder</span>
          </span>
        </div>
        <div className="h-0.5 rounded bg-[linear-gradient(90deg,#1A1A3E_0%,#4ADE80_100%)] max-w-[120px] mx-auto" />
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Ramesh Nuti. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
