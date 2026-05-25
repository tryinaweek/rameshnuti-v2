import type { Metadata } from "next";
import { ArticleLayout } from "@/components/ArticleLayout";

export const metadata: Metadata = {
  title: "How to Start a Startup in the AI Era",
  description:
    "An operator's guide to finding AI startup ideas, building defensible moats, and applying the Last $5K Rule. By Ramesh Nuti.",
  openGraph: {
    title: "How to Start a Startup in the AI Era",
    description:
      "The way to find a startup idea in the AI era is not to think about AI. It's to notice things that are broken, then ask: could AI fix this in a way that couldn't have been possible two years ago?",
    type: "article",
    authors: ["Ramesh Nuti"],
    publishedTime: "2026-03-17",
    images: [
      {
        url: "/og-ai-era.png",
        width: 1200,
        height: 640,
        alt: "How to Start a Startup in the AI Era",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Start a Startup in the AI Era",
    description:
      "An operator's guide to finding AI startup ideas, building defensible moats, and applying the Last $5K Rule.",
    images: ["/og-ai-era.png"],
    creator: "@RameshNuti",
  },
};

export default function ArticlePage() {
  return (
    <ArticleLayout
      title="How to Start a Startup in the AI Era"
      description="The way to find a startup idea in the AI era is not to think about AI. It's to notice things that are broken, then ask: could AI fix this in a way that couldn't have been possible two years ago?"
      date="March 2026"
      category="AI & Startups"
      readTime="12 min read"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
  .article-standalone {
    --ink: #0f172a;
    --ink-mid: #334155;
    --ink-soft: #64748b;
    --ink-ghost: #94a3b8;
    --paper: #ffffff;
    --paper-warm: #f8fafc;
    --paper-rule: #cbd5e1;
    --accent: #2563eb;
    --accent-pale: #eff6ff;
    --accent-mid: #1d4ed8;
    --gold: #3b82f6;
    --gold-pale: #eff6ff;
  }

  .article-standalone {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Lora', Georgia, serif;
    font-size: 17px;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
  }

  .article-standalone .toc-band {
    background: var(--paper-warm);
    border-top: 1px solid var(--paper-rule);
    border-bottom: 1px solid var(--paper-rule);
    margin-bottom: 40px;
    border-radius: 12px;
  }
  .article-standalone .toc-band-inner {
    padding: 24px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 32px;
    align-items: start;
  }
  .article-standalone .toc-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-ghost);
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    align-self: center;
  }
  .article-standalone .toc-list {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 24px;
    padding: 0;
    margin: 0;
  }
  .article-standalone .toc-list a {
    display: flex;
    align-items: baseline;
    gap: 10px;
    text-decoration: none;
    color: var(--ink-mid);
    font-family: 'Lora', serif;
    font-size: 14px;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }
  .article-standalone .toc-list a:hover {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
  .article-standalone .toc-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--accent);
    min-width: 20px;
  }
  .article-standalone .section {
    margin-bottom: 64px;
    padding-bottom: 64px;
    border-bottom: 1px solid var(--paper-rule);
  }
  .article-standalone .section:last-child {
    border-bottom: none;
  }
  .article-standalone .section-number {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .article-standalone .section-number::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--paper-rule);
  }
  .article-standalone .section h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 750;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin-bottom: 24px;
    color: var(--ink);
  }
  .article-standalone .section h2 em {
    font-style: italic;
    color: var(--accent);
  }
  .article-standalone .section p {
    color: var(--ink-mid);
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 1.7;
  }
  .article-standalone .section p strong {
    color: var(--ink);
    font-weight: 600;
  }
  .article-standalone .pull-quote {
    border-left: 3px solid var(--accent);
    padding: 4px 0 4px 24px;
    margin: 32px 0;
  }
  .article-standalone .pull-quote p {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    line-height: 1.4;
    color: var(--accent-mid);
    font-style: italic;
  }
  .article-standalone .callout {
    background: var(--paper-warm);
    border: 1px solid var(--paper-rule);
    border-left: 3px solid var(--accent);
    padding: 20px 24px;
    margin: 32px 0;
    border-radius: 8px;
  }
  .article-standalone .callout-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
    font-weight: 600;
  }
  .article-standalone .callout p {
    font-size: 14.5px;
    color: var(--ink-mid);
    margin-bottom: 8px;
  }
  .article-standalone .callout p:last-child {
    margin-bottom: 0;
  }
  .article-standalone .rule-box {
    border: 1px solid var(--paper-rule);
    background: var(--paper);
    padding: 24px 28px;
    margin: 32px 0;
    position: relative;
    border-radius: 8px;
  }
  .article-standalone .rule-box-num {
    position: absolute;
    top: -10px;
    left: 20px;
    background: var(--accent);
    color: #ffffff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 2px 10px;
    letter-spacing: 0.1em;
    border-radius: 4px;
  }
  .article-standalone .rule-box h3 {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--accent-mid);
    margin-bottom: 8px;
    margin-top: 4px;
  }
  .article-standalone .rule-box p {
    font-size: 14.5px;
    color: var(--ink-mid);
    margin: 0;
  }
  .article-standalone .framework-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2px;
    margin: 32px 0;
    border: 1px solid var(--paper-rule);
    overflow: hidden;
    border-radius: 8px;
  }
  .article-standalone .framework-cell {
    background: var(--paper-warm);
    padding: 16px 18px;
    border: 1px solid var(--paper-rule);
  }
  .article-standalone .framework-cell:first-child {
    background: var(--ink);
    color: #ffffff;
    grid-column: 1 / -1;
    padding: 12px 18px;
  }
  .article-standalone .framework-cell:first-child p {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-ghost);
    margin: 0;
  }
  .article-standalone .fc-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 18px;
    color: var(--accent);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 6px;
  }
  .article-standalone .fc-title {
    font-family: 'Lora', serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .article-standalone .fc-desc {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ink-soft);
    margin: 0;
  }
  .article-standalone .editorial {
    padding-left: 20px;
    margin: 32px 0;
  }
  .article-standalone .editorial li {
    margin-bottom: 18px;
    padding-left: 6px;
  }
  .article-standalone .editorial li p {
    font-size: 15px;
    color: var(--ink-mid);
    margin: 0;
  }
  .article-standalone .editorial li p strong {
    color: var(--ink);
  }
  .article-standalone .section-divider {
    font-family: 'Lora', serif;
    text-align: center;
    font-size: 20px;
    color: var(--ink-ghost);
    margin: 48px 0;
    letter-spacing: 0.3em;
  }
  .article-standalone .terminal {
    background: var(--ink);
    color: #c8e6c9;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    padding: 24px;
    margin: 32px 0;
    border-radius: 8px;
  }
  .article-standalone .terminal .prompt { color: var(--accent); }
  .article-standalone .terminal .comment { color: #7a8e7c; }
  .article-standalone .compare-table {
    width: 100%;
    border-collapse: collapse;
    margin: 32px 0;
    font-size: 13.5px;
    border: 1px solid var(--paper-rule);
    border-radius: 8px;
    overflow: hidden;
  }
  .article-standalone .compare-table th {
    background: var(--ink);
    color: #ffffff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 10px 14px;
    text-align: left;
    font-weight: 500;
  }
  .article-standalone .compare-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--paper-rule);
    color: var(--ink-mid);
    vertical-align: top;
  }
  .article-standalone .compare-table tr:nth-child(even) td {
    background: var(--paper-warm);
  }
  .article-standalone .compare-table .label-col {
    font-weight: 600;
    color: var(--ink);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  .article-standalone .tag-old {
    display: inline-block;
    background: #f1f5f9;
    color: #475569;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .article-standalone .tag-new {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    .article-standalone .toc-band-inner { padding: 16px; grid-template-columns: 1fr; gap: 12px; }
    .article-standalone .toc-label { writing-mode: horizontal-tb; transform: none; }
    .article-standalone .toc-list { grid-template-columns: 1fr; }
  }
`,
        }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IBM+Plex+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />

      <div className="article-standalone">
        {/* TOC */}
        <nav className="toc-band">
          <div className="toc-band-inner">
            <div className="toc-label">Contents</div>
            <ul className="toc-list">
              <li><a href="#problems"><span className="toc-num">01</span>Problems Before Technology</a></li>
              <li><a href="#timing"><span className="toc-num">06</span>The New Timing Question</a></li>
              <li><a href="#operator"><span className="toc-num">02</span>Operator First</a></li>
              <li><a href="#filters"><span className="toc-num">07</span>New Filters to Turn Off</a></li>
              <li><a href="#well"><span className="toc-num">03</span>The Narrow Well Still Wins</a></li>
              <li><a href="#competition"><span className="toc-num">08</span>Competition in an AI Market</a></li>
              <li><a href="#surface"><span className="toc-num">04</span>The New Surface Area</a></li>
              <li><a href="#moat"><span className="toc-num">09</span>Moats That Actually Hold</a></li>
              <li><a href="#live"><span className="toc-num">05</span>Live in the Future, Build What&apos;s Missing</a></li>
              <li><a href="#recipes"><span className="toc-num">10</span>Practical Recipes</a></li>
            </ul>
          </div>
        </nav>

        {/* BODY */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
  <section class="section" id="intro">
    <p>Paul Graham wrote "How to Get Startup Ideas" in 2012. The principles he laid down were so sturdy that most of them still hold. Work on problems you have yourself. Find the narrow well of users who desperately need what you're building. Become the kind of person who notices what's missing, rather than someone who brainstorms ideas in a vacuum.</p>
    <p>But the terrain has shifted. The arrival of large language models, AI agents, and cheap inference has done something unusual: it changed which problems are solvable, almost overnight. Problems that required 20 engineers in 2021 can be prototyped by one person with a credit card and a good prompt in 2026.</p>
    <p>That changes the filter. Not the direction of the filter — you still need a real problem, a real user with urgent need, a path to a big market. But it changes the set of problems that are now within reach. And it changes the kind of founder who can reach them.</p>
    <p>This is a guide written from the operator's seat — for founders who've run something, who understand execution friction from the inside, and who want to apply the AI moment to real, gnarly, difficult-to-fix problems.</p>
  </section>

  <section class="section" id="problems">
    <div class="section-number">01</div>
    <h2>Problems Before <em>Technology</em></h2>
    <p>The biggest mistake I see in the AI era is founders who start with a model. They discover that GPT-4 can summarize documents, so they build a document summarizer. They see that Claude can write code, so they wrap it in an IDE. This is backwards.</p>
    <p>Graham's original insight holds, but it needs to be said louder in a world where the technology is suddenly, visibly, dramatically impressive: <strong>start with the problem, not the capability.</strong></p>
    <div class="pull-quote"><p>"Most AI startups I pass on are in love with the technology. The ones I fund are in love with the problem."</p></div>
    <p>The right question is never "What can I build with AI?" It's "What breaks, hurts, or costs too much in my industry — and is there now an AI-powered approach that makes a real dent?"</p>
    <p>The AI is a new ingredient in your pantry. But first you need to decide what you're cooking, and for whom.</p>
    <div class="callout"><div class="callout-label">The founder test</div><p>Write down the three most painful operational problems you faced in your last job or company. Now ask, for each one: was this problem technically unsolvable before 2023? If the answer is yes — even partially — you're holding a possible AI startup idea.</p><p>This is not brainstorming. This is memory. The best ideas are sitting in your own scar tissue.</p></div>
    <p>Graham said the best startup ideas are ones you yourself want, can build, and that few others realize are worth doing. In the AI era, add a fourth condition: <strong>the solution is now technically feasible in a way it wasn't.</strong> That fourth condition is the unlock. It's why now is different from 2019.</p>
  </section>

  <section class="section" id="operator">
    <div class="section-number">02</div>
    <h2><em>Operator First,</em> Investor Second</h2>
    <p>This is my personal investment identity, but it applies to founding too. The operators — the people who have run something, who understand what it actually takes to onboard a customer, close a contract, deal with compliance, hire and fire, manage cash — they see AI startup ideas that pure technologists miss.</p>
    <p>Why? Because the hard problems aren't technical. They never were. The hard problems are the ones with messy human processes behind them. Procurement workflows. Claims adjudication. Compliance documentation. EDI transaction processing. These aren't glamorous. But they're enormous, they're painful, and they're sticky in ways that consumer social apps never are.</p>
    <div class="rule-box"><div class="rule-box-num">The Operator Advantage</div><h3>You know where the bodies are buried</h3><p>An operator who spent years in healthcare revenue cycle management knows exactly which step in the workflow causes 80% of the denials. A pure technologist would take 12 months of customer discovery to get to the same insight — if they ever do. Your operational experience is your unfair advantage at the idea stage. Don't undervalue it in favor of building something that looks more technically impressive.</p></div>
    <p>The best AI founders I've backed or evaluated are not AI researchers. They're domain experts who learned enough about AI to recognize where the technology could eliminate the most painful friction in their domain. That combination is rare and enormously valuable.</p>
    <p>If you're a programmer who has never operated anything, that's fine — but go find a co-founder who has. Not a business co-founder in the generic sense. A domain operator. Someone who has lived the problem from the inside.</p>
  </section>

  <section class="section" id="well">
    <div class="section-number">03</div>
    <h2>The Narrow Well <em>Still Wins</em></h2>
    <p>Graham's metaphor of the well versus the shallow lake remains the single most useful filter for evaluating startup ideas. You want a small number of people who urgently need what you're building — not a large number who could vaguely imagine using it someday.</p>
    <p>In the AI era, this is actually more true, not less. The surface area of AI capabilities is vast and shallow. Millions of people can imagine some vague use for an AI assistant, a co-pilot, a summarizer. None of them need it urgently enough to pay for it, switch from existing tools, or become advocates.</p>
    <div class="pull-quote"><p>Find the hundred people who will be furious if you shut your product down. Build for them first. The million users come later, or they don't — but you need that hundred first.</p></div>
    <p>What does a narrow well look like in practice? It looks like a compliance officer at a mid-market manufacturer who currently spends three days a month on EDI mapping errors. It looks like a VP of Finance at a Series B company who is rebuilding every financial model from scratch every time the board changes a projection. It looks like a solo medical biller who is getting 40% of claims rejected on technicalities they can't track manually.</p>
    <p>These people have urgency. They have budget. They have a specific workflow that is broken and costing real money. They are the narrow well.</p>
    <div class="callout"><div class="callout-label">Well-depth test</div><p>Describe your target user in one sentence. If that sentence contains the words "anyone," "people who," or "businesses that want to," your well is too broad. Try again. Add an industry, a role, a specific pain point, a specific consequence of not solving it. Keep adding specificity until the sentence sounds almost embarrassingly narrow. That's the well.</p></div>
  </section>

  <section class="section" id="surface">
    <div class="section-number">04</div>
    <h2>The New Surface Area</h2>
    <p>One thing has genuinely changed: the scope of what one or two founders can build has expanded dramatically. In 2012, Graham said you should learn programming because software was eating the world. In 2026, the advice is different — you should learn how to direct AI, because AI-assisted building has collapsed the cost of creating sophisticated software.</p>
    <p>This means the set of valid startup ideas is larger. Problems that once required a 10-person engineering team can now be prototyped by a domain expert with strong taste and the ability to iterate quickly with AI tools. The bottleneck has shifted from "can we build this?" to "do we deeply understand the problem we're solving?"</p>
    <table class="compare-table"><thead><tr><th>Dimension</th><th><span class="tag-old">2012 era</span> Software startup</th><th><span class="tag-new">2026 era</span> AI-native startup</th></tr></thead><tbody><tr><td class="label-col">Core requirement</td><td>Ability to write code</td><td>Ability to deeply understand a problem domain</td></tr><tr><td class="label-col">Prototype speed</td><td>Weeks to months for MVP</td><td>Days to weeks with AI-assisted development</td></tr><tr><td class="label-col">Moat source</td><td>Technical differentiation, network effects</td><td>Proprietary data, workflow depth, trust, distribution</td></tr><tr><td class="label-col">Key bottleneck</td><td>Engineering capacity</td><td>Domain insight and customer trust</td></tr><tr><td class="label-col">Competitive threat</td><td>Better-funded team with more engineers</td><td>Foundation model providers building down-market</td></tr><tr><td class="label-col">Best founder profile</td><td>Technical founder with domain exposure</td><td>Domain operator who can direct AI development</td></tr></tbody></table>
    <p>This table is not an argument for non-technical founders. Technical literacy still matters — probably more than ever, because you need to understand what AI systems can and cannot do, where they hallucinate, where they fail, and what the reliability thresholds are for your specific use case. But "technical" in 2026 means something different than it did in 2012. You don't need to be able to write a database schema from scratch. You need to be able to evaluate a system critically and direct its construction precisely.</p>
  </section>

  <section class="section" id="live">
    <div class="section-number">05</div>
    <h2>Live in the Future, <em>Build What's Missing</em></h2>
    <p>Graham's most elegant formulation: "Live in the future, then build what's missing." It came from Paul Buchheit's observation that people at the leading edge of a rapidly changing field live in the future. Their daily experience is of a world that doesn't exist yet for most people. The startup ideas are the gaps between that future and today.</p>
    <p>This has a specific meaning in the AI era. If you are a heavy user of current AI tools — not just ChatGPT for writing emails, but actually using agents, evaluating models, building workflows, understanding where the edges are — you will naturally encounter the places where the tools break, the processes that aren't yet automated, the gaps where a real product is missing.</p>
    <div class="terminal"><span class="comment"># The right question to ask yourself daily:</span><br><br><span class="prompt">$</span> What did I do today that I expect AI to do for me in 2 years?<br><span class="prompt">$</span> What frustrated me about current AI tools?<br><span class="prompt">$</span> What would I have built if I had 30 engineers?<br><span class="comment"><br># If you can't answer these, you're not living close enough to the frontier.</span></div>
    <p>Living in the future in the AI era means staying close to the research, yes — but more importantly it means being a power user of AI systems in your domain of expertise. The convergence of domain depth and tool familiarity is where the organic startup idea lives.</p>
    <p>This is how I found ActionEDI. I wasn't looking for a startup. I was living in the operational reality of EDI transaction processing — something most people have never heard of, something that runs under the surface of billions of dollars of B2B commerce — and the gap became obvious. The technology had reached the point where it was solvable. The timing was right. The insight came from living in the problem, not from brainstorming.</p>
  </section>

  <section class="section" id="timing">
    <div class="section-number">06</div>
    <h2>The New Timing Question</h2>
    <p>Graham talks about the "prepared mind" — the founder who is at the leading edge of a fast-changing field, so when an external stimulus arrives, they recognize the opportunity where others don't.</p>
    <p>In the AI era, timing has a new dimension. The question isn't just "is this a real problem?" It's also: "is this the exact moment when solving this problem has become feasible, and when the market is ready to pay for a solution?"</p>
    <p>The AI moment has created a specific type of timing opportunity: <strong>the infrastructure is now available, but the vertically-integrated application layer does not yet exist.</strong> The models are commodity. The deployment tools are commodity. The gap is the domain-specific, workflow-deep, trust-earning application layer that serves a specific industry or function with something genuinely better than the existing workflow.</p>
    <ol class="editorial"><li><p><strong>The technology crossed a threshold.</strong> Something that required unreliable, expensive bespoke ML in 2021 can now be done reliably with off-the-shelf models. Find where that happened in your domain.</p></li><li><p><strong>The incumbents are flat-footed.</strong> Legacy software vendors in most B2B verticals are 18-36 months behind on AI integration. Their customers know this and are actively looking for alternatives.</p></li><li><p><strong>The regulation clock is ticking.</strong> In some verticals, AI adoption is being actively pushed by regulatory changes — or conversely, the compliance burden is becoming a forcing function for automation. Both create urgency.</p></li><li><p><strong>Labor dynamics have shifted.</strong> In specific industries, the talent shortage for certain skilled roles has reached a point where AI augmentation isn't a nice-to-have — it's existential for the businesses that need those roles filled.</p></li></ol>
    <p>If you can check two or more of these boxes for your target problem, the timing is real. If you can only check one, the timing may be early — which means you're right but you may run out of runway before the market catches up.</p>
  </section>

  <section class="section" id="filters">
    <div class="section-number">07</div>
    <h2>New Filters to Turn Off</h2>
    <p>Graham identified two filters to turn off: the schlep filter (fear of tedious work) and the unsexy filter (distaste for unglamorous problems). These still apply in the AI era. If anything, the schlep filter is more important to override now, because the most valuable AI applications are in exactly the messiest, most compliance-heavy, most process-dense domains that nobody wants to deal with.</p>
    <p>But there are new filters to watch for:</p>
    <div class="framework-grid"><div class="framework-cell"><p>New filters to turn off in the AI era</p></div><div class="framework-cell"><div class="fc-num">F1</div><div class="fc-title">The "just a wrapper" filter</div><p class="fc-desc">The fear that your product is "just" calling an API and therefore not defensible. Most great B2B applications are workflow systems built on top of commodity infrastructure. That's fine. The value is in the workflow depth, not the model.</p></div><div class="framework-cell"><div class="fc-num">F2</div><div class="fc-title">The "AI will solve it" filter</div><p class="fc-desc">The assumption that foundation model providers will eventually build what you're building. They might. But they also might not — they're optimizing for horizontal platform reach, not vertical workflow depth. Specialization is your edge.</p></div><div class="framework-cell"><div class="fc-num">F3</div><div class="fc-title">The "not technical enough" filter</div><p class="fc-desc">The belief that because you're not an ML researcher, you can't build a serious AI company. Domain expertise paired with the ability to direct AI systems is often more valuable than research depth for application-layer companies.</p></div><div class="framework-cell"><div class="fc-num">F4</div><div class="fc-title">The "hallucination blocker" filter</div><p class="fc-desc">The assumption that because AI makes mistakes, it can't be deployed in high-stakes workflows. The question is whether the AI-plus-human workflow is better than the human-only workflow. In most cases, the bar is low enough that it is.</p></div></div>
    <p>The "just a wrapper" filter deserves special attention because it's particularly insidious. Founders who have been around long enough to remember the SaaS era know that "Salesforce is just a database" or "Dropbox is just a folder" were the wrong dismissals at the time. The application-layer company that goes deep on a specific workflow and earns customer trust will be difficult to displace even as the underlying models commoditize.</p>
  </section>

  <section class="section" id="competition">
    <div class="section-number">08</div>
    <h2>Competition in an <em>AI Market</em></h2>
    <p>Graham's advice on competition holds: don't be deterred by finding competitors. A crowded market means real demand and no solution good enough. Your job is to find the specific insight that existing competitors are missing — the dimension on which you can be clearly better for a specific set of users.</p>
    <p>In the AI era, the competitive dynamics have a specific wrinkle: <strong>the barriers to entry for a first version are very low, but the barriers to becoming the default are very high.</strong> Anyone can spin up a GPT wrapper in a weekend. But becoming the system of record for a specific workflow — the thing people depend on daily, the thing with deep integrations, the thing with trained models on proprietary data — takes years.</p>
    <div class="pull-quote"><p>The race in AI is not to launch first. It's to reach operational depth first. The startup that understands a workflow deeply enough to get embedded in it wins, regardless of who launched first.</p></div>
    <p>This means your thesis about what competitors are overlooking should be articulated in terms of workflow depth, not feature breadth. "We go deeper on X workflow" is a credible thesis. "We do everything the incumbent does but with AI" is not.</p>
    <p>The specific patterns I look for when evaluating whether a startup has a real competitive thesis:</p>
    <ol class="editorial"><li><p>They can name the exact step in the workflow where their product is 10x better than the existing solution — and they can demonstrate it live.</p></li><li><p>They have customers who have gotten value and can explain specifically what changed for them — not "it saves time" but "it reduced our DSO by 12 days" or "we went from 40% denial rate to 14%."</p></li><li><p>They have a theory about why the incumbent can't copy this: regulatory complexity, data moat, distribution advantage, or the fact that the incumbent's architecture makes this kind of deep workflow integration impossible.</p></li></ol>
  </section>

  <section class="section" id="moat">
    <div class="section-number">09</div>
    <h2>Moats That <em>Actually Hold</em></h2>
    <p>This is the question I spend the most time on as an investor, and the one founders are most likely to get wrong. In the AI era, many things that look like moats aren't. And some things that look like commodities are actually deep competitive advantages.</p>
    <p><strong>What doesn't hold as a moat:</strong> Model quality (commoditizing fast), prompt engineering (replicable), basic automation of a known workflow (low switching costs), speed (temporary).</p>
    <p><strong>What does hold as a moat:</strong></p>
    <div class="framework-grid"><div class="framework-cell"><p>Durable AI-era moats</p></div><div class="framework-cell"><div class="fc-num">M1</div><div class="fc-title">Proprietary data generated by use</div><p class="fc-desc">Every transaction, correction, and human review makes your model better in ways a competitor starting from scratch cannot replicate. This compounds. Start designing for data flywheel from day one.</p></div><div class="framework-cell"><div class="fc-num">M2</div><div class="fc-title">Workflow depth and integration cost</div><p class="fc-desc">The deeper you are in a customer's operational workflow, the more expensive it is to rip you out. Be the system of record, not the nice-to-have add-on. Charge accordingly.</p></div><div class="framework-cell"><div class="fc-num">M3</div><div class="fc-title">Trust and regulatory compliance</div><p class="fc-desc">In regulated industries, being the vendor that cleared compliance review is an enormous barrier to replacement. Get certified early. It's a schlep, and that's exactly why it creates a moat.</p></div><div class="framework-cell"><div class="fc-num">M4</div><div class="fc-title">Network effects from multi-party workflows</div><p class="fc-desc">If your product sits between multiple parties — buyer and supplier, provider and payer, employer and employee — and it gets better as more nodes join, you have a real network effect. These are rare and extremely durable.</p></div></div>
    <p>The moat question I always ask founders: if OpenAI or Anthropic decided to build your product next quarter, how long would it take before they could replace you with your best current customers? If the answer is "under 18 months," you have a product, not a company. If the answer is "they'd have to replicate 3 years of domain-specific training data and a dozen enterprise integrations," you have a business.</p>
  </section>

  <section class="section" id="recipes">
    <div class="section-number">10</div>
    <h2>Practical <em>Recipes</em></h2>
    <p>Graham was skeptical of recipes — he believed the organic approach (becoming the kind of person who has good ideas) was superior to deliberate brainstorming. I agree with the underlying principle. But when you need to pressure-test an idea you already have, or when you're stuck and need a direction, the following frameworks have worked for me.</p>
    <div class="rule-box"><div class="rule-box-num">Recipe 01</div><h3>The Process Archaeology Approach</h3><p>Go back to your last job or company. Write down every process that involved a human doing something that felt like it should be automated. Focus especially on the ones where the reason it wasn't automated was complexity, not neglect. Those are the ones that are now solvable.</p></div>
    <div class="rule-box"><div class="rule-box-num">Recipe 02</div><h3>The Bottleneck Map</h3><p>Pick an industry you know well. Draw the value chain from input to output. Circle every step where a knowledge worker currently acts as a bottleneck — reviewing, approving, translating, escalating. Each circle is a potential AI startup. Now ask which circle has the highest cost per transaction and the most room for AI assistance. Start there.</p></div>
    <div class="rule-box"><div class="rule-box-num">Recipe 03</div><h3>The Angry Expert Test</h3><p>Find five domain experts in a target industry. Ask them what tool, workflow, or process makes them the most irrationally angry. Not annoyed — furious. The thing they rant about at conferences. That frustration is usually evidence of a gap between what exists and what should exist. Now ask whether AI has crossed a threshold that could fill that gap.</p></div>
    <div class="rule-box"><div class="rule-box-num">Recipe 04</div><h3>The Time Machine Question</h3><p>Imagine it's 2030 and you're looking back. What products exist that everyone uses daily and says "I can't believe we didn't have this in 2026"? Write down five. For each one, ask: could I build the 2026 version of that today, for the early adopters who already see the gap? One of those is probably worth starting.</p></div>
    <div class="callout"><div class="callout-label">The Last $5K Rule, applied to your own idea</div><p>Before you commit to building something, ask yourself: if this were the last $5,000 I could ever invest — of my own time, my own credibility, my own relationships — would I still do this?</p><p>No credit for vision or a pretty deck. No glossing over the execution risk. If you can honestly say yes with a full view of the downside, you've passed your own gut check. That's the bar.</p></div>
    <p>The final thing I'll say about recipes: the best way to validate an AI startup idea is not to survey potential customers. It's to build a rough version and try to sell it. Not fake it, not show a mockup — actually build a version that does the core thing, go to someone who has the problem, and try to get them to pay for it. Everything else is speculation. The market will tell you faster than any framework.</p>
    <p>Graham quotes Paul Buchheit: "The best technique for dealing with bad ideas is to tell the founder to go sell the product immediately." In the AI era, the cost of building a rough first version is low enough that there's almost no excuse to wait. Build it, sell it, find out if it's real. The answer will come back within weeks, not years.</p>
  </section>

  <div class="section-divider">* * *</div>

  <section class="section">
    <h2>What I Look for as an Investor, Reframed as Founder Advice</h2>
    <p>I evaluate every deal through a 10-criteria framework at Svyam Ventures. When I flip it around and ask what it implies for founders, it reduces to a few principles:</p>
    <ol class="editorial"><li><p><strong>Be the founder who is obviously right about the problem.</strong> When you explain the problem you're solving, anyone who knows the industry should be nodding immediately. If you have to convince people the problem is real, you're in trouble.</p></li><li><p><strong>Show asymmetric upside at a reasonable valuation.</strong> Don't price yourself like you've already won. Give early investors and early customers a reason to take the risk with you. Generosity at the early stage creates advocates who will matter later.</p></li><li><p><strong>Have a specific, falsifiable traction milestone for the next 90 days.</strong> Not a vague goal. A number. A customer name. A contract. Something that can be checked. Founders who think in milestones are founders who are operating, not just vision-casting.</p></li><li><p><strong>Know your unit economics direction early, even if the numbers are small.</strong> You don't need to be profitable at Series A. But you need to know whether your margins improve or compress as you scale, and why. Founders who don't know this have usually built the wrong thing.</p></li><li><p><strong>Pass the Last $5K Rule.</strong> Would you bet your last dollar on this? If not, don't expect anyone else to. That conviction — grounded in reality, not optimism — is what separates founders who last from founders who pivot into oblivion.</p></li></ol>
    <p>The AI era has lowered the cost of starting and raised the ceiling of what's possible. That's a generational opportunity. But the fundamentals — real problems, real urgency, deep domain understanding, honest conviction, operational grit — haven't changed. They never do.</p>
    <p>Build something you'd be furious not to have. Find the narrow well. Stay close enough to the frontier that the gaps become obvious. The rest is execution.</p>
  </section>
            `,
          }}
        />
      </div>
    </ArticleLayout>
  );
}
