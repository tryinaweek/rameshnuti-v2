import { redirect } from 'next/navigation';

import { DEFAULT_WORKSHOP } from '@/lib/workshops';

/**
 * Legacy URL — shared on QR codes and in WhatsApp posts before workshops
 * became multi-tenant. The default workshop's resources page accepts the old
 * unlock cookie, so existing visitors pass straight through.
 */
export default function LegacyWorkshopResources() {
  redirect(`/workshops/${DEFAULT_WORKSHOP.slug}/resources`);
}
