# Ramesh Nuti - Personal Brand System

## Identity

Ramesh Nuti. 2x founder. Investor @ Svyam Ventures (25+ investments). Vibe coder (75+ shipped projects). Director, Startup Grind Frisco.

This brand applies to all personal projects, tools, content, and artifacts. NOT ActionEDI (separate brand).

## Brand Philosophy

Four colors. Two modes. One person.

**Signature mode** (midnight + teal): your identity mark, avatar, badges, footer, brand bar. The builder. Shows up on every tool, every post, every artifact. Matches rameshnuti.com.

**Hero mode** (midnight + terracotta): banners, featured sections, event promos, slide headers, book covers, workshop announcements. The founder/connector. Warmth and authority.

**Violet** weaves through both modes as the vibe coder/tech layer. Input borders, code labels, tech badges, tool UI details, and anything related to vibe coding projects.

## Color System

### Midnight (Foundation)
Dark background for cards, heroes, premium sections, and signature elements.
- Midnight: #1A1A3E
- Midnight light: #252550

### Teal/Mint (The Builder) — PRIMARY
Your anchor. Established on rameshnuti.com. Primary CTAs on white, signature accent, links, icons, numbered badges.
- Teal 50: #CCFBF1
- Teal 100: #99F6E4
- Teal 200: #5EEAD4
- Teal 300: #2DD4BF
- Teal 400: #14B8A6
- Mint (bright CTA): #4ADE80
- Teal 600: #0D9488
- Teal 800 (text on teal bg): #115E59

Use #4ADE80 for primary CTAs on white backgrounds (matches website).

### Terracotta (The Connector) — SECONDARY
Warmth, community, hero sections. CTAs on dark backgrounds, accent labels, event tags, secondary highlights.
- Terra light: #F5E0D8
- Terra 200: #D4896E
- Terra 400 (primary): #C2694A
- Terra 600: #A85638
- Terra 800 (text on terra bg): #6B3424

### Violet (The Vibe Coder) — TERTIARY
Tech depth, code references, vibe coding projects. Input borders, code labels, tech badges, secondary links.
- Violet 50: #EDE9FE
- Violet 100: #C4B5FD
- Violet 200: #A78BFA
- Violet 400 (primary): #8B5CF6
- Violet 600: #7C3AED
- Violet 800 (text on violet bg): #5B21B6

### Neutrals
- White (page bg): #FFFFFF
- Light surface: #FAFAFA
- Primary text: #111111
- Secondary text: #666666
- Muted text: #999999
- White text (on dark): #FFFFFF
- Dim text (on dark): rgba(255,255,255,0.5)

## Usage Rules

### Signature Elements (midnight + teal)
- Avatar gradient: midnight → teal
- Signature brand bar: midnight → teal
- Core badges (founder, builder, investments): midnight bg, teal text
- Footer signature: teal for name
- Tool headers: teal accent on white

### Hero Sections (midnight + terracotta)
- Background: midnight (#1A1A3E)
- Labels/tags: terracotta
- CTA buttons on dark: terracotta bg, white text
- Subtle radial glow: terracotta at 15% opacity for warmth
- Use for: event promos, workshop banners, book announcements, Svyam Challenge, slide headers

### Tool Result Cards (midnight + tri-color accents)
- Card background: midnight
- Section 1 (vulnerability): teal accent
- Section 2 (arguments/content): terracotta accent
- Section 3 (questions/depth): violet accent
- Each card has a 3px color bar at top

### Vibe Coding Projects (violet emphasis)
- Input focus borders: violet
- Code/monospace labels: violet
- Tech badges: violet bg light, violet text dark
- "Vibe coder" identity badge: violet
- Use violet more prominently in tools/projects specifically about coding, AI building, prompt engineering

### CTA Buttons
- On white backgrounds: teal (#4ADE80), dark text (#111)
- On dark/midnight backgrounds: terracotta (#C2694A), white text
- Secondary/outline: terracotta border, terracotta text (hover: fill terracotta)

### NEVER
- Green that could be confused with ActionEDI
- Beige or warm-white backgrounds (use pure #FFFFFF)
- Gradient on buttons or large areas
- Muted or dusty color versions
- Equal weighting of all four colors (midnight+teal always lead)

## Signature Elements

### Avatar
```css
background: linear-gradient(135deg, #1A1A3E 0%, #4ADE80 100%);
```

### Signature Brand Bar (identity)
```css
background: linear-gradient(90deg, #1A1A3E 0%, #4ADE80 100%);
```

### Full Brand Bar (tools, slides, content)
```css
background: linear-gradient(90deg, #1A1A3E 0%, #4ADE80 40%, #C2694A 70%, #8B5CF6 100%);
```

### Identity Badges
```css
/* Core identity (midnight + teal) */
background: #1A1A3E; color: #4ADE80;

/* Community/connector (terracotta) */
background: #F5E0D8; color: #6B3424;

/* Vibe coder/tech (violet) */
background: #EDE9FE; color: #5B21B6;
```

### Footer Signature
```
Built by Ramesh Nuti · 2x founder · investor @ Svyam Ventures · vibe coder
```
"Ramesh Nuti" in teal (#4ADE80), "investor" in terracotta (#C2694A), "vibe coder" in violet (#8B5CF6).
Link: https://www.linkedin.com/in/rameshnuti/

## Typography

- Headings: "DM Sans", sans-serif (weight 500, 700)
- Body: "DM Sans", sans-serif (weight 400)
- Code/labels: "JetBrains Mono", monospace (weight 400)
- Hero: 36-48px | Title: 24-28px | Section: 18-20px
- Body: 15-16px | Small: 12-13px | Tags: 10-11px

## Voice

- Direct, not harsh. Short declarative sentences.
- Builder, not guru. Lead with what you shipped.
- Dual lens. Founder + investor perspective.
- No em dashes. No engineered hooks. No engagement bait.
- No "game-changer", "unlock", "leverage", "delve", "landscape"
- Closing lines: declarative, memorable, not questions.

## CSS Variables

```css
:root {
  --midnight: #1A1A3E;
  --midnight-light: #252550;
  --teal-50: #CCFBF1;
  --teal-100: #99F6E4;
  --teal-200: #5EEAD4;
  --teal-400: #14B8A6;
  --teal-mint: #4ADE80;
  --teal-600: #0D9488;
  --teal-800: #115E59;
  --terra-light: #F5E0D8;
  --terra-200: #D4896E;
  --terra-400: #C2694A;
  --terra-600: #A85638;
  --terra-800: #6B3424;
  --violet-50: #EDE9FE;
  --violet-100: #C4B5FD;
  --violet-200: #A78BFA;
  --violet-400: #8B5CF6;
  --violet-600: #7C3AED;
  --violet-800: #5B21B6;
  --white: #FFFFFF;
  --surface: #FAFAFA;
  --text-primary: #111111;
  --text-secondary: #666666;
  --text-muted: #999999;
  --brand-primary: #4ADE80;
  --brand-secondary: #C2694A;
  --brand-tertiary: #8B5CF6;
  --sig-gradient: linear-gradient(135deg, #1A1A3E 0%, #4ADE80 100%);
  --sig-bar: linear-gradient(90deg, #1A1A3E 0%, #4ADE80 100%);
  --full-bar: linear-gradient(90deg, #1A1A3E 0%, #4ADE80 40%, #C2694A 70%, #8B5CF6 100%);
}
```

## Tailwind Extend

```js
colors: {
  midnight: { DEFAULT: '#1A1A3E', light: '#252550' },
  teal: { 50:'#CCFBF1', 100:'#99F6E4', 200:'#5EEAD4', 400:'#14B8A6', mint:'#4ADE80', 600:'#0D9488', 800:'#115E59' },
  terra: { light:'#F5E0D8', 200:'#D4896E', 400:'#C2694A', 600:'#A85638', 800:'#6B3424' },
  violet: { 50:'#EDE9FE', 100:'#C4B5FD', 200:'#A78BFA', 400:'#8B5CF6', 600:'#7C3AED', 800:'#5B21B6' },
},
backgroundImage: {
  'sig-gradient': 'linear-gradient(135deg, #1A1A3E 0%, #4ADE80 100%)',
  'sig-bar': 'linear-gradient(90deg, #1A1A3E 0%, #4ADE80 100%)',
  'full-bar': 'linear-gradient(90deg, #1A1A3E 0%, #4ADE80 40%, #C2694A 70%, #8B5CF6 100%)',
},
```

## Component Patterns

### Button (primary on white)
```css
background: #4ADE80; color: #111; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 700;
```

### Button (primary on dark)
```css
background: #C2694A; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 700;
```

### Button (secondary outline)
```css
background: transparent; color: #C2694A; border: 2px solid #C2694A; border-radius: 8px; padding: 12px 24px; font-weight: 700;
```

### Input field
```css
background: #FAFAFA; border: 2px solid #E5E5E5; border-radius: 8px; padding: 12px 16px;
font-family: 'JetBrains Mono', monospace; color: #111;
/* Focus: */ border-color: #8B5CF6;
```

### Dark card (midnight)
```css
background: #1A1A3E; color: #FFFFFF; border-radius: 10px; padding: 20px;
```

### Hero section
```css
background: #1A1A3E; border-radius: 12px; padding: 32px; position: relative; overflow: hidden;
/* Subtle terracotta glow: */
/* Add radial-gradient(circle at corner, #C2694A22 0%, transparent 70%) as pseudo-element */
```

## Distribution Reminder

Everything built under this brand should include a LinkedIn link, be shareable, and reinforce the path from 4K to 10K+ followers. Every tool ladders up to selling products, processes, courses, and consulting.
