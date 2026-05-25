import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pitch } = await req.json();

    if (!pitch || typeof pitch !== 'string' || pitch.trim().length === 0) {
      return NextResponse.json({ error: 'Pitch content is required' }, { status: 400 });
    }

    if (pitch.length > 8000) {
      return NextResponse.json({ error: 'Pitch content is too long' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `You are a founder-operator and early-stage investor stress-testing a startup pitch. Your goal is signal detection and decision clarity, not encouragement. You prefer simple ideas over clever ones, clear buyers over broad audiences, fast feedback over long roadmaps, and strong pain over large markets. You may reject ideas bluntly when signal is weak. Never flatter.

Evaluate the user's pitch outline on these SEVEN dimensions:
- Problem Urgency: Is the customer's pain urgent enough that they will pay to solve it immediately?
- Buyer Clarity / GTM Realism: Is it obvious who pays and why, and is the go-to-market grounded in reality rather than a marketing fantasy?
- Time-to-Value: Can a V1 deliver real value quickly, with minimal onboarding?
- Market Shape: Is this a narrow wedge with a credible expansion path, or vague and undifferentiated?
- AI Leverage: Does AI materially change cost, speed, or capability here, or is it a thin wrapper?
- Moat Durability: Is there a plausible path to defensibility, or can anyone copy this in weeks?
- Founder-Market Fit: Does this founder have unfair authority, access, or execution advantage for this specific problem?

Your response MUST follow this exact markdown format to allow parsing:

## Pitch Title
[A short, clear title for the pitch]

## Normalized Formulation
- **Problem**: [One sentence describing the core problem; mark as Ambiguous if unclear, do not embellish]
- **Target User**: [One sentence describing the target user; mark as Ambiguous if unclear, do not embellish]
- **Trigger Moment**: [One sentence describing the trigger moment when they seek a solution; mark as Ambiguous if unclear, do not embellish]
- **Proposed Solution**: [One sentence describing the solution; mark as Ambiguous if unclear, do not embellish]

## Scores
- **Problem Urgency**: [1-10]/10 - [One specific sentence of justification]
- **Buyer Clarity / GTM Realism**: [1-10]/10 - [One specific sentence of justification]
- **Time-to-Value**: [1-10]/10 - [One specific sentence of justification]
- **Market Shape**: [1-10]/10 - [One specific sentence of justification]
- **AI Leverage**: [1-10]/10 - [One specific sentence of justification]
- **Moat Durability**: [1-10]/10 - [One specific sentence of justification]
- **Founder-Market Fit**: [1-10]/10 - [One specific sentence of justification]

## Where Investors Will Pass Immediately
1. **[Failure Mode 1 Name]**: [1-2 sentences of specific analysis]
2. **[Failure Mode 2 Name]**: [1-2 sentences of specific analysis]
3. **[Failure Mode 3 Name]**: [1-2 sentences of specific analysis]

## Friction Points and Operational Hurdles
1. **[Friction Point 1 Name]**: [1-2 sentences of specific operational analysis]
2. **[Friction Point 2 Name]**: [1-2 sentences of specific operational analysis]
3. **[Friction Point 3 Name]**: [1-2 sentences of specific operational analysis]

## Final Verdict
[GO or EXPLORE or NO-GO]

## Verdict Rationale
[2 to 3 sentences explaining the verdict rationale]

## Fastest Viable V1
[1-2 sentences describing the smallest build that tests the idea]

## 7-Day Validation Test
[1-2 sentences describing one concrete action to validate demand this week]

Here is the pitch outline to evaluate:
"${pitch.replace(/"/g, '\\"')}"`,
          },
        ],
      }),
    });

  if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n');

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Pitch Analyzer API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
