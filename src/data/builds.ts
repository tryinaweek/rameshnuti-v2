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
  {
    build_number: 2,
    title: 'Book Cricket',
    slug: 'book-cricket',
    short_description:
      'The classroom game every Indian kid played under the desk, rebuilt as a two-minute daily chase with a share card. One Saturday, a PRD first, and a simulation that changed the rules before a line of UI existed.',
    hero_image: '',
    live_product_url: 'https://bookcricket.com',
    publish_date: '2026-09-02',
    difficulty: 'Beginner-friendly',
    estimated_build_time: 'One Saturday',
    topics: ['Games', 'Nostalgia', 'Virality', 'Product Design', 'Next.js'],

    why_i_built_it:
      'I own bookcricket.com and I played the game. Open a textbook at random, read the page number, the last digit is your runs, a zero is a wicket. Every kid in India in the 80s and 90s ran a Test match this way while a maths lesson happened above the desk.\n\nThe category has real search demand and no owner. Every existing app is ad-heavy, dated, and abandoned, and most of them fail on taste before they fail on anything else. The bet was never a business. It was a brand asset: a product people send to a school WhatsApp group, plus a public build story.\n\nThe honest read before starting: a random number generator has no skill curve and no reason to come back. So the product had to be the share card and a daily target, not the game.',

    product_flow: [
      'Open the site. Today’s target is the same for everyone in the world',
      'The other side bats first, flipping itself in about ten seconds',
      'Tap the book. The page riffles, the number lands, the runs count',
      'Chase the target in five overs with five wickets',
      'Share the result. The link replays the match and renders a card',
    ],

    tools: [
      { category: 'Frontend', name: 'Next.js 16, React 19, Tailwind 4' },
      { category: 'Backend', name: 'None. One route handler for the optional email line' },
      { category: 'AI model', name: 'Claude Code as the implementation agent, me as the reviewer at every gate' },
      { category: 'Database', name: 'Supabase, the same people table as rameshnuti.com, for the optional email' },
      { category: 'Hosting', name: 'Vercel, domain on Cloudflare DNS' },
      { category: 'Payments', name: 'None. Free, no ads' },
      { category: 'Analytics', name: 'Fathom, four events: started, completed, shared, returned' },
    ],

    workflow: [
      'Wrote a one-page PRD with a ship gate and a kill criterion, then got sign-off before any code',
      'Checked what existed: a dozen abandoned apps and a physical board game. Nobody owned taste',
      'Built the match engine as pure TypeScript with tests, no React, so share links can replay a match on the server',
      'Simulated 2,000 matches. The locked format of 5 overs and 10 wickets meant innings never ended early, so wickets did not matter. Changed to 5 wickets a side before building the UI',
      'Rendered the play screen from real engine output and reviewed it on a phone viewport before adding interaction',
      'Added the flip animation, the auto-flipped opponent, the notebook scorecard, and a daily target seeded from the date',
      'Verified every phase with a headless iPhone that plays a full match and screenshots each state',
      'Shipped share links that carry the whole match in the URL, with a server-rendered card image, then domain, analytics, and search',
    ],

    prompts: [
      {
        label: 'The gate prompt that started the build',
        body: 'New repo, Phase 1 scope as proposed, write the PRD, before we proceed, is it worth building? Will this have any mileage?',
        note: 'Asking whether to build before asking how to build is the whole trick. The answer changed the scope: the share card became the product.',
      },
      {
        label: 'The design feedback after the first playable version',
        body: 'On the book, you don’t have any place to tap on it for the player to play the game. Is there any way that we can give some indication that the player can play the game on the book? Nowhere on the book or anywhere else has any sort of cricket feel. Can we bring some cricket feel into it, maybe on the page, when they’re clicking on it, give them cricket quotes or something that will be memorable?',
        note: 'Feedback from actually playing it on a phone, not from a screenshot. It produced the tap prompt, the folded page corner, the cricket ball mark, and a printed line on every page you land on.',
      },
    ],

    what_worked: [
      'PRD first, with a ship gate and a kill criterion. Every later decision had something to be checked against.',
      'Simulating the rules before designing the UI. Ten wickets looked right on paper and was wrong in play. Two thousand simulated matches found it in seconds.',
      'A pure engine with tests. The share link is just the config and two seeds, and the server replays the match to draw the card. No database, no expiry.',
      'Live-render verification on a phone viewport at every phase. It caught an invisible button, two overflowing screens, and a page number hidden behind a folded corner.',
      'Saying no to real quotes. The cricket lines on the pages are original, so no player names and no licensing question.',
    ],

    what_failed: [
      'One line of unlayered CSS I added to reset buttons beat Tailwind’s utilities and made every primary button’s text invisible. The screenshot caught it. The code review did not.',
      'The first play screen and start screen both ran about seventy pixels past an iPhone viewport. Design on a phone, not a desktop browser.',
      'I rewrote the sound to survive the iPhone ringer switch, then reverted it, because the shipped version was confirmed working on a real phone and the rewrite was not. Verified beats better.',
      'A font subset download came back as garbage and the file command said so. Check the bytes, not the filename.',
      'First Lighthouse run scored 86 against a gate of 90. The start screen only rendered on the client, so the largest paint waited for hydration.',
    ],

    costs: [
      { item: 'AI / API', amount: '$0', note: 'Claude Code under the existing subscription' },
      { item: 'Hosting', amount: '$0', note: 'Vercel, within the existing plan' },
      { item: 'Database', amount: '$0', note: 'Supabase, the existing project' },
      { item: 'Payment fees', amount: '$0', note: 'Nothing is sold' },
      { item: 'Other services', amount: 'TODO', note: 'Domain renewal for bookcricket.com. Fathom is on the existing plan.' },
    ],

    business_model: {
      how_it_makes_money: 'It does not, by design. It is a brand asset: a thing people send to each other, with my name in the footer and a build story attached.',
      pricing: 'Free. No ads.',
      why_this_pricing: 'Ads are off-brand and would make it look like every book cricket app that already failed. The value is the audience it builds and the story it lets me tell.',
      what_id_test_next: 'Share rate and return rate over thirty days. If either clears the target in the PRD, Phase 2 adds leaderboards and a daily target email to the list this build already collects.',
    },

    three_build_ideas: [
      {
        name: 'Hand Cricket',
        description: 'The odd-or-even finger game, as a two-player daily with a share card.',
        who_its_for: 'The same nostalgia audience, plus anyone with a sibling and a long car ride.',
        mvp: 'One screen, five finger buttons, a computer opponent, a shareable result. No accounts.',
      },
      {
        name: 'Name Place Animal Thing',
        description: 'The letter game from the back of the notebook, with a shared daily letter and a timer.',
        who_its_for: 'Families and school groups on WhatsApp. It works across generations.',
        mvp: 'A daily letter, a sixty-second timer, four inputs, and a card that shows your answers without judging them.',
      },
      {
        name: 'Paper Fortune Teller',
        description: 'The folded paper chatterbox, as a card you send to a friend with your own messages inside.',
        who_its_for: 'Anyone who wants to send a small, playful message instead of a text.',
        mvp: 'Eight editable messages, a link, and the fold animation. Nothing else.',
      },
    ],

    build_checklist: [
      'Write the PRD with a ship gate and a kill criterion',
      'Check what exists before building anything',
      'Build the engine first, pure and tested',
      'Simulate the numbers before designing the screens',
      'Render on a phone viewport before judging any design',
      'One action per screen',
      'Treat the share card as the product',
      'Ship with a date to decide whether to continue',
    ],

    seo_title: 'How I Built Book Cricket in a Saturday | Build With Me',
    seo_description:
      'The classroom game rebuilt as a two-minute daily chase with a share card. The PRD, the simulation that changed the rules, what broke, and what it cost.',
    og_image: '',

    download_file: '',
    email_tag: 'Build With Me - Book Cricket',

    // Draft until Ramesh reviews it in the admin panel and publishes.
    status: 'draft',
    featured_on_home: false,
    updated_at: '2026-09-02T00:00:00.000Z',
  },
];
