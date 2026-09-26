/**
 * The official Substack signup embed for "Ship This Week with Ramesh Nuti".
 *
 * Substack is the one canonical mailing list, and this is Substack's own,
 * supported way to collect a signup from another site: the visitor types
 * their address into Substack's iframe, Substack owns the confirmation, and
 * nothing passes through our servers. It is the only capture on the site that
 * does not also write to THE LIST, because the iframe never tells us the
 * address — which is fine, since Supabase is memory, not the list.
 *
 * Substack ships the iframe with a hard-coded 480px width, which overflows on
 * most phones. The wrapper below lets it shrink to the container and keeps
 * its aspect so the form never clips.
 */

export const SUBSTACK_PUBLICATION_URL = "https://startupvalue.substack.com";

export function SubstackEmbed({
  heading = "Ship This Week",
  copy = "One email a week: what I built or tested, what it cost, what broke, and anything worth stealing.",
  compact = false,
}: {
  heading?: string;
  copy?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-slate-light border border-slate-100 rounded-2xl text-left ${
        compact ? "p-6" : "p-6 md:p-8"
      }`}
    >
      <div className="space-y-1.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Newsletter
        </p>
        <h3 className={`font-bold tracking-tight text-slate-900 ${compact ? "text-base" : "text-lg"}`}>
          {heading}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500">{copy}</p>
      </div>

      {/* Substack's embed is fixed at 480x320. The wrapper scales it to the
          available width and lets it grow taller on narrow screens, where the
          form's own layout wraps. */}
      <div className="mt-4 w-full max-w-[480px] overflow-hidden rounded-lg border border-slate-200 bg-white">
        <iframe
          src={`${SUBSTACK_PUBLICATION_URL}/embed`}
          title="Subscribe to Ship This Week with Ramesh Nuti on Substack"
          width="480"
          height="320"
          loading="lazy"
          className="block h-[320px] w-full max-w-full border-0"
          style={{ background: "white" }}
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Hosted by Substack. Unsubscribe anytime, from any email.
      </p>
    </div>
  );
}
