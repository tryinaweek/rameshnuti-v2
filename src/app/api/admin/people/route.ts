import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin-auth';
import { readPeople } from '@/lib/people';

/** The unified people directory, merged across every product's signup table. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const directory = await readPeople();
  if (!directory) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not set, so the directory cannot be read.' },
      { status: 503 },
    );
  }
  return NextResponse.json(directory);
}
