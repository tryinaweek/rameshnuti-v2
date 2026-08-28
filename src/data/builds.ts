import type { Build } from '@/lib/build-types';

/**
 * Seed builds — what /build renders before anything has been saved from the
 * admin panel, and the fallback if the blob store is unreachable.
 *
 * Build #001 is staged with real facts only. Everything Ramesh has not told
 * me yet is written as a `TODO:` line, which the page renders as a visible
 * "fill this in" marker rather than inventing a detail about the product.
 * Saving the build from /admin replaces this record permanently.
 */
export const SEED_BUILDS: Build[] = [
  {
    build_number: 1,
    title: 'The Headshot App',
    slug: 'headshot-app',
    short_description:
      'Generate a professional AI headshot from one selfie, show the result before asking the user to pay, and keep the product intentionally simple.',
    hero_image: '',
    live_product_url: 'https://www.theheadshotapp.com',
    publish_date: '2026-08-29',
    difficulty: 'Beginner-friendly',
    estimated_build_time: 'Weekend project',
    topics: ['AI Images', 'Micro-SaaS', 'Product Design', 'Monetization'],

    why_i_built_it:
      'TODO: Write the problem or curiosity that triggered this build. Two or three short paragraphs is plenty.',

    product_flow: [
      'Upload one selfie',
      'Generate AI headshot',
      'Show watermarked preview',
      'Let the user pay only for the HD version',
    ],

    tools: [
      { category: 'Frontend', name: 'TODO: which frontend did you use?' },
      { category: 'Backend', name: 'TODO: which backend did you use?' },
      { category: 'AI model', name: 'TODO: which image model generated the headshots?' },
      { category: 'Database', name: 'TODO: which database stored users and credits?' },
      { category: 'Hosting', name: 'TODO: where is it hosted?' },
      { category: 'Payments', name: 'TODO: which payment processor?' },
      { category: 'Analytics', name: 'TODO: which analytics tool?' },
    ],

    workflow: [
      'TODO: Replace these with the real steps. One short line per step, in order.',
      'User uploads image',
      'App sends image and prompt to the model',
      'Model returns the generated result',
      'Result is displayed with a watermark',
      'User purchases credits',
      'HD image becomes downloadable',
    ],

    prompts: [
      {
        label: 'TODO: name this prompt',
        body: 'TODO: Paste the actual prompt you used here. Readers copy these, so paste them exactly as they ran, including any system or style instructions.',
        note: '',
      },
    ],

    what_worked: [
      'TODO: What actually worked? Keep each lesson to one or two sentences.',
    ],

    what_failed: [
      'TODO: What broke, what you got wrong, and what you would change. Be specific. This is the section people learn the most from, so it should not read like a success story.',
    ],

    costs: [
      { item: 'AI / API', amount: 'TODO', note: '' },
      { item: 'Hosting', amount: 'TODO', note: '' },
      { item: 'Database', amount: 'TODO', note: '' },
      { item: 'Payment fees', amount: 'TODO', note: '' },
      { item: 'Other services', amount: 'TODO', note: '' },
    ],

    business_model: {
      how_it_makes_money: 'TODO: How does it make money?',
      pricing: 'TODO: What do you charge, and for what?',
      why_this_pricing: 'TODO: Why that price and not another one?',
      what_id_test_next: 'TODO: What is the next pricing or packaging test?',
    },

    three_build_ideas: [
      {
        name: 'LinkedIn Banner Maker',
        description:
          'Upload a photo and job title. Generate 3 professional LinkedIn banners.',
        who_its_for: 'TODO: who is this for?',
        mvp: 'TODO: what is the simplest version worth shipping?',
      },
      {
        name: 'Product Photo Studio',
        description:
          'Upload one product photo. Generate ecommerce, lifestyle, and ad-ready images.',
        who_its_for: 'TODO: who is this for?',
        mvp: 'TODO: what is the simplest version worth shipping?',
      },
      {
        name: 'Speaker Headshot Generator',
        description:
          'Upload one selfie. Generate conference-ready headshots with different backgrounds and crops.',
        who_its_for: 'TODO: who is this for?',
        mvp: 'TODO: what is the simplest version worth shipping?',
      },
    ],

    build_checklist: [
      'Define the smallest useful output',
      'Choose one input',
      'Generate one output',
      'Show the user value quickly',
      'Add payment only after the experience works',
      'Ship the ugly version',
      'Get 5 people to test it',
    ],

    seo_title: 'How I Built an AI Headshot App From One Selfie | Build With Me',
    seo_description:
      'A weekend build: generate a professional AI headshot from one selfie, show the result before asking anyone to pay, and keep the product intentionally simple.',
    og_image: '',

    download_file: '',
    email_tag: 'Build With Me - Headshot App',

    status: 'published',
    // Stays off the homepage until Ramesh flips it in the admin panel.
    featured_on_home: false,
    updated_at: '2026-08-28T00:00:00.000Z',
  },
];
