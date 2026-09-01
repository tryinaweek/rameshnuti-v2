'use client';

import { trackEvent } from 'fathom-client';

/**
 * An outbound link that records the click in Fathom. Used for live product
 * links and Build Pack downloads, the two clicks that say whether a teardown
 * actually sent anyone anywhere.
 */
export function TrackedLink({
  href,
  event,
  className,
  external = true,
  download = false,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  external?: boolean;
  download?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(event)}
      {...(download ? { download: '' } : {})}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
