/**
 * Build With Me — the shape of one build, plus the pure helpers that both the
 * server pages and the admin editor need.
 *
 * This module deliberately imports nothing: the admin panel is a client
 * component, and importing the blob-backed `@/lib/builds` from the browser
 * would drag the Vercel Blob SDK into the client bundle.
 */

export type BuildStatus = 'draft' | 'published';

/** A tool used in the build, grouped under one of TOOL_CATEGORIES. */
export interface BuildTool {
  category: string;
  name: string;
  note?: string;
}

export interface BuildPrompt {
  label: string;
  body: string;
  note?: string;
}

export interface BuildCost {
  item: string;
  amount: string;
  note?: string;
}

export interface BuildIdea {
  name: string;
  description: string;
  who_its_for: string;
  mvp: string;
}

export interface BuildBusinessModel {
  how_it_makes_money: string;
  pricing: string;
  why_this_pricing: string;
  what_id_test_next: string;
}

export interface BuildPackFile {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface Build {
  build_number: number;
  title: string;
  slug: string;
  short_description: string;
  hero_image: string;
  live_product_url: string;
  publish_date: string;
  difficulty: string;
  estimated_build_time: string;
  topics: string[];

  why_i_built_it: string;
  product_flow: string[];
  tools: BuildTool[];
  workflow: string[];
  prompts: BuildPrompt[];
  what_worked: string[];
  what_failed: string[];
  costs: BuildCost[];
  business_model: BuildBusinessModel;
  three_build_ideas: BuildIdea[];
  build_checklist: string[];

  /** Overrides the generated <title>. Empty falls back to seoTitleFor(). */
  seo_title: string;
  /** Overrides the meta description. Empty falls back to short_description. */
  seo_description: string;
  /** Open Graph image for this build. Empty falls back to the site image. */
  og_image: string;

  /** Filename of the Build Pack inside build/<slug>/pack/. Empty = none yet. */
  download_file: string;
  /** Provider tag applied on signup, alongside the section-wide tag. */
  email_tag: string;

  status: BuildStatus;
  /** Drafts and unfeatured builds never reach the homepage. */
  featured_on_home: boolean;
  updated_at: string;
}

/** Card-sized view of a build, used by the library and the admin list. */
export type BuildSummary = Pick<
  Build,
  | 'build_number'
  | 'title'
  | 'slug'
  | 'short_description'
  | 'hero_image'
  | 'live_product_url'
  | 'publish_date'
  | 'difficulty'
  | 'estimated_build_time'
  | 'topics'
  | 'status'
  | 'featured_on_home'
  | 'updated_at'
>;

export const REGISTRY_PATH = 'build/_registry.json';

/** The section-wide tag every Build With Me signup gets. */
export const SECTION_EMAIL_TAG = 'Build With Me';

/** The stack fields a build page can fill in, in display order. */
export const TOOL_CATEGORIES = [
  'Frontend',
  'Backend',
  'AI model',
  'Database',
  'Hosting',
  'Payments',
  'Analytics',
  'Other tools',
] as const;

export const DIFFICULTY_OPTIONS = [
  'Beginner-friendly',
  'Beginner',
  'Intermediate',
  'Advanced',
] as const;

/**
 * Anything a build page still needs from Ramesh is written starting with
 * TODO, so the page renders it as an obvious "fill this in" marker instead of
 * quietly passing it off as finished copy.
 *
 * Matches "TODO: something" and a bare "TODO" alike.
 */
export function isTodo(value: string): boolean {
  return /^TODO\b/i.test(value.trim());
}

export function todoText(value: string): string {
  return value.trim().replace(/^TODO\b:?/i, '').trim();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function buildNumberLabel(n: number): string {
  return `#${String(n).padStart(3, '0')}`;
}

/**
 * "How I Built The Headshot App | Build With Me" — the search-friendly shape,
 * generated so a new edition needs no SEO work, and overridable per build with
 * the seo_title field when a better headline exists.
 */
export function seoTitleFor(build: Pick<Build, 'title' | 'seo_title'>): string {
  if (build.seo_title.trim()) return build.seo_title.trim();
  return `How I Built ${build.title} | Build With Me`;
}

export function toSummary(build: Build): BuildSummary {
  return {
    build_number: build.build_number,
    title: build.title,
    slug: build.slug,
    short_description: build.short_description,
    hero_image: build.hero_image,
    live_product_url: build.live_product_url,
    publish_date: build.publish_date,
    difficulty: build.difficulty,
    estimated_build_time: build.estimated_build_time,
    topics: build.topics,
    status: build.status,
    featured_on_home: build.featured_on_home,
    updated_at: build.updated_at,
  };
}

/** Fills in every field so older saved records survive a schema addition. */
export function normalizeBuild(raw: Partial<Build>): Build {
  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

  return {
    build_number: typeof raw.build_number === 'number' ? raw.build_number : 0,
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    short_description: raw.short_description ?? '',
    hero_image: raw.hero_image ?? '',
    live_product_url: raw.live_product_url ?? '',
    publish_date: raw.publish_date ?? '',
    difficulty: raw.difficulty ?? '',
    estimated_build_time: raw.estimated_build_time ?? '',
    topics: arr(raw.topics),
    why_i_built_it: raw.why_i_built_it ?? '',
    product_flow: arr(raw.product_flow),
    tools: Array.isArray(raw.tools) ? raw.tools : [],
    workflow: arr(raw.workflow),
    prompts: Array.isArray(raw.prompts) ? raw.prompts : [],
    what_worked: arr(raw.what_worked),
    what_failed: arr(raw.what_failed),
    costs: Array.isArray(raw.costs) ? raw.costs : [],
    business_model: {
      how_it_makes_money: raw.business_model?.how_it_makes_money ?? '',
      pricing: raw.business_model?.pricing ?? '',
      why_this_pricing: raw.business_model?.why_this_pricing ?? '',
      what_id_test_next: raw.business_model?.what_id_test_next ?? '',
    },
    three_build_ideas: Array.isArray(raw.three_build_ideas) ? raw.three_build_ideas : [],
    build_checklist: arr(raw.build_checklist),
    seo_title: raw.seo_title ?? '',
    seo_description: raw.seo_description ?? '',
    og_image: raw.og_image ?? '',
    download_file: raw.download_file ?? '',
    email_tag: raw.email_tag || `${SECTION_EMAIL_TAG} - ${raw.title ?? ''}`.trim(),
    status: raw.status === 'published' ? 'published' : 'draft',
    featured_on_home: raw.featured_on_home === true,
    updated_at: raw.updated_at ?? new Date().toISOString(),
  };
}
