# rameshnuti.com - Project Brief

## What this is
Personal brand + education platform for Ramesh Nuti. Migrating from Lovable (Vite + React) to Next.js on Vercel. Progressive build approach.

## Brand identity
2x founder. Investor @ Svyam Ventures (25+ investments). Vibe coder (75+ shipped projects, top 5% on Replit with 42 apps). Director, Startup Grind Frisco. MS in Computer Science.

## Hero line
"75+ AI projects shipped. All vibe coded. I'll teach you the system."

## Brand system (see brand.md for full specs)
Four colors:
- Midnight (#1A1A3E): dark backgrounds, cards, hero sections
- Teal/Mint (#4ADE80): primary CTAs on white, signature accent, links, icons, badges
- Terracotta (#C2694A): hero section CTAs, warmth, community, secondary highlights
- Violet (#8B5CF6): input borders, code labels, tech badges, vibe coder identity

Signature elements (avatar, brand bar, badges): midnight + teal
Hero sections (banners, promos, events): midnight + terracotta
Vibe coding / tech context: violet accents

Fonts: DM Sans (headings/body), JetBrains Mono (code/labels)
Backgrounds: pure white (#FFFFFF), never beige

## Site structure

### Pages needed for Phase 1:
1. **Homepage** - hero with tagline, credibility section (Replit badge showing top 5% / 42 apps + "30+ more on Lovable, Cursor, Claude Code"), tools preview, course waitlist, newsletter signup
2. **/tools** - index page listing all tools
3. **/tools/steelman** - Steelman the Opposition tool (already built, files ready in repo)
4. **/toolkit** - migrate existing toolkit page (AI agents, prompting course, frameworks, apps)
5. **/writing** - articles/blog (MDX), migrate existing content
6. **/about** - about page with full bio, Startup Grind, Svyam Ventures one-liner with link
7. **/courses** - course catalog with waitlist capture for upcoming courses, link to existing 14-day prompting course

### API routes:
- **/api/steelman** - proxies Anthropic API for the Steelman tool (route.ts already built)
- Future tool API routes follow same pattern

## Tech stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS (with brand colors from brand.md)
- DM Sans + JetBrains Mono from Google Fonts
- Supabase for newsletter signups and future auth
- Vercel for hosting
- No database needed for Phase 1 tools (stateless AI wrappers)

## What to migrate from current site
- Navigation component
- Footer component
- Logo / brand mark
- FadeIn animation
- ThemeToggle (dark/light mode)
- shadcn/ui components
- Toolkit page content (Essential AI Skills deck, 20+ agents, prompting course, frameworks, apps)
- Supabase integration (keys already configured)

## What NOT to build in Phase 1
- Payment / Stripe (Phase 2)
- Course progress tracking (Phase 3)
- Student dashboard (Phase 3)
- Analytics dashboard (deferred)
- Headless CMS (deferred, use MDX for now)

## Content notes
- The 14-day prompting course currently lives on playwithprompts.com. For Phase 1, link to it. In Phase 2, migrate it to rameshnuti.com/courses/prompting.
- playwithprompts.com will eventually redirect to rameshnuti.com
- 100 users on playwithprompts.com will be migrated with consent via email

## SEO requirements
- SSR for all pages (Next.js default)
- Meta tags and Open Graph images for social sharing
- Structured data for courses and tools
- Page title format: "[Page Name] | Ramesh Nuti"

## Credibility section
Show Replit badge/screenshot: "Top 5% on Replit · 42 apps built"
Below it: "Plus 30+ more built on Lovable, Cursor, Claude Code, and others."
Also show: 25+ startup investments, Startup Grind Frisco director, 14+ years in tech

## Upcoming events to showcase
- April-June 2026: Startup Grind Frisco paid workshops (AI agent building, vibe coding MVP, AI workflow automation)
- The Vibe Coder's OS book (coming soon)

## Voice rules
- No em dashes
- No engineered hooks ("Here's the thing...")
- No engagement bait closers
- No "game-changer", "unlock", "leverage", "delve"
- Short declarative sentences
- Closing lines: declarative, memorable, not questions

## Distribution reminder
Everything on this site should drive LinkedIn audience growth (current: ~4,000, goal: 10,000+). Every tool includes a LinkedIn link. Every page is shareable. Every project reinforces the personal brand and ladders up to selling courses, consulting, and workshops.
