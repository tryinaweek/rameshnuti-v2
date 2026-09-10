/**
 * Unified people directory.
 *
 * This Supabase project is shared by several products, and each one keeps its
 * own signup table. Nobody has a single "users" table, so this module reads the
 * tables that actually hold an address, normalizes them into one shape, and
 * merges by email.
 *
 * Server only: every read uses SUPABASE_SERVICE_ROLE_KEY, which must never
 * reach a browser bundle.
 */

const SUPABASE_URL = 'https://nbfkibomkxvqyaoakmma.supabase.co';

/** Where one address was found, and what that tells us about the person. */
export interface PersonRecord {
  /** Product label, e.g. "Play With Prompts". */
  app: string;
  /** The table it came from, so a surprising row can be traced back. */
  table: string;
  /** Raw source/tag value on that row, when the table records one. */
  source: string | null;
  /** ISO timestamp this record was created, when the table records one. */
  at: string | null;
  /** Referrer or UTM campaign, on the one table that captures it. */
  origin: string | null;
}

export interface Person {
  email: string;
  name: string | null;
  /** Distinct product labels this address appears under. */
  apps: string[];
  /** Earliest timestamp across every record. */
  firstSeen: string | null;
  /** Where they came from, when any record knows. */
  origin: string | null;
  records: PersonRecord[];
}

export interface PeopleDirectory {
  people: Person[];
  /** Every app label present, for the filter control. */
  apps: string[];
  /** Tables that could not be read, so the UI can admit the gap. */
  failed: string[];
  totalRecords: number;
}

/**
 * One entry per table that holds an email.
 *
 * `app` may be a function when a single table serves several products, which is
 * the case for `people`: its `source` column is the only thing separating a
 * workshop attendee from a prompt-game account.
 */
interface TableSpec {
  table: string;
  select: string;
  app: string | ((row: Row) => string);
  nameField?: string;
  sourceField?: string;
  dateField?: string;
  originOf?: (row: Row) => string | null;
}

type Row = Record<string, unknown>;

const str = (v: unknown): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s : null;
};

/** `people.source` is the only signal separating products in that table. */
export function appFromPeopleSource(source: string | null): string {
  const s = (source ?? '').toLowerCase();
  if (s.startsWith('workshop')) return 'Workshop';
  if (s.startsWith('build-')) return 'Build With Me';
  if (s.startsWith('tool-') || s === 'tools') return 'Tools';
  if (s.startsWith('newsletter') || s === 'articles') return 'Newsletter';
  if (s === 'courses-waitlist') return 'Courses';
  if (s.startsWith('game') || s === 'bookcricket') return 'Games';
  // Signups written by the prompt-game app, which tags everything "account".
  if (s === 'account') return 'Play With Prompts';
  return 'Other';
}

const TABLES: TableSpec[] = [
  {
    table: 'people',
    select: 'email,name,source,first_seen',
    app: (r) => appFromPeopleSource(str(r.source)),
    nameField: 'name',
    sourceField: 'source',
    dateField: 'first_seen',
  },
  {
    table: 'profiles',
    select: 'email,full_name,created_at,user_type',
    app: 'Play With Prompts',
    nameField: 'full_name',
    sourceField: 'user_type',
    dateField: 'created_at',
  },
  {
    table: 'ai_prompt_users',
    select: 'email,full_name,signup_source,created_at',
    app: 'Play With Prompts',
    nameField: 'full_name',
    sourceField: 'signup_source',
    dateField: 'created_at',
  },
  {
    table: 'prompt_game_profiles',
    select: 'email,full_name,created_at',
    app: 'Prompt Game',
    nameField: 'full_name',
    dateField: 'created_at',
  },
  {
    table: 'build_signups',
    select: 'email,first_name,build_title,utm_source,utm_medium,utm_campaign,referrer,created_at',
    app: 'Build With Me',
    nameField: 'first_name',
    sourceField: 'build_title',
    dateField: 'created_at',
    // The only table that records how someone actually arrived.
    originOf: (r) => {
      const utm = [str(r.utm_source), str(r.utm_medium), str(r.utm_campaign)].filter(Boolean);
      if (utm.length) return utm.join(' / ');
      return str(r.referrer);
    },
  },
  {
    table: 'beta_signups',
    select: 'email,source,created_at',
    app: 'Beta',
    sourceField: 'source',
    dateField: 'created_at',
  },
  {
    table: 'catch_subscribers',
    select: 'email,source,created_at',
    app: 'Catch',
    sourceField: 'source',
    dateField: 'created_at',
  },
  {
    table: 'early_access_emails',
    select: 'email,name,created_at',
    app: 'Early Access',
    nameField: 'name',
    dateField: 'created_at',
  },
  {
    table: 'newsletter_subscribers',
    select: 'email,created_at',
    app: 'Newsletter',
    dateField: 'created_at',
  },
  { table: 'subscribers', select: 'email,created_at', app: 'Newsletter', dateField: 'created_at' },
  {
    table: 'tip_subscribers',
    select: 'email,created_at',
    app: 'Daily Tips',
    dateField: 'created_at',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Reads every signup table and merges by email.
 *
 * Returns null when the service role key is absent, so the dashboard can show a
 * setup hint instead of an empty directory that looks like real data.
 */
export async function readPeople(): Promise<PeopleDirectory | null> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;

  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
  const byEmail = new Map<string, Person>();
  const failed: string[] = [];
  let totalRecords = 0;

  const results = await Promise.all(
    TABLES.map(async (spec) => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${spec.table}?select=${spec.select}&limit=50000`,
          { headers, cache: 'no-store' },
        );
        if (!res.ok) return { spec, rows: null };
        return { spec, rows: (await res.json()) as Row[] };
      } catch {
        return { spec, rows: null };
      }
    }),
  );

  for (const { spec, rows } of results) {
    // A table that has been dropped or renamed must not blank the whole page.
    if (rows === null) {
      failed.push(spec.table);
      continue;
    }
    for (const row of rows) {
      const email = str(row.email)?.toLowerCase();
      if (!email || !EMAIL_RE.test(email)) continue;
      totalRecords += 1;

      const source = spec.sourceField ? str(row[spec.sourceField]) : null;
      const record: PersonRecord = {
        app: typeof spec.app === 'function' ? spec.app(row) : spec.app,
        table: spec.table,
        source,
        at: spec.dateField ? str(row[spec.dateField]) : null,
        origin: spec.originOf ? spec.originOf(row) : null,
      };

      const existing = byEmail.get(email);
      const name = spec.nameField ? str(row[spec.nameField]) : null;
      if (!existing) {
        byEmail.set(email, {
          email,
          name,
          apps: [record.app],
          firstSeen: record.at,
          origin: record.origin,
          records: [record],
        });
        continue;
      }
      existing.records.push(record);
      if (!existing.apps.includes(record.app)) existing.apps.push(record.app);
      existing.name ??= name;
      existing.origin ??= record.origin;
      if (record.at && (!existing.firstSeen || record.at < existing.firstSeen)) {
        existing.firstSeen = record.at;
      }
    }
  }

  const people = [...byEmail.values()].sort((a, b) => {
    if (!a.firstSeen) return 1;
    if (!b.firstSeen) return -1;
    return b.firstSeen.localeCompare(a.firstSeen);
  });
  for (const p of people) p.apps.sort();

  const apps = [...new Set(people.flatMap((p) => p.apps))].sort();
  return { people, apps, failed, totalRecords };
}
