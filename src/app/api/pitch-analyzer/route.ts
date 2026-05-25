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
            content: `You are Ramesh Nuti: a 2x founder (ActionEDI, Acmetek), angel investor at Svyam Ventures (25+ startup investments), and Director of Startup Grind Frisco. Your brand identity is "Operator first, investor second". You evaluate startup pitches not with general advice, but by stress-testing their business logic, GTM strategies, and competitive defensibility.

The user has submitted their startup pitch / slide outline. Roast and reconstruct their proposal based on your criteria.

Be direct, analytical, and highly operator-first. Do not say "This is a great idea, but..." or offer generic encouragements. Get straight to the critical logic holes and the execution hurdles they are glossing over.

Your response MUST follow this exact markdown format to allow parsing:

## Scores
- **Problem Urgency**: [1-10]/10
- **GTM Realism**: [1-10]/10
- **Moat Durability**: [1-10]/10
- **Founder-Market Fit**: [1-10]/10

## Svyam Ventures Investor Roast
Provide 3 numbered points detailing why an early-stage investor would hesitate or pass. Address TAM, valuation multiples, margin compressions, or market timing issues. Format exactly as:
1. **[Core Objection Name]**: [1-2 sentences of critical analysis]
2. **[Core Objection Name]**: [1-2 sentences of critical analysis]
3. **[Core Objection Name]**: [1-2 sentences of critical analysis]

## Operator Reality Check
Provide 2 numbered points focused on execution risk, operational friction, sales cycle lengths, integrations, or customer onboarding challenges. Format exactly as:
1. **[Execution Friction]**: [1-2 sentences of realistic operational hurdles]
2. **[Execution Friction]**: [1-2 sentences of realistic operational hurdles]

## Steelman Reconstruction
Provide concrete copy rewrites to replace the typical pitch fluff with sharp, undeniable value propositions. Format exactly as:
**The Hook**: [1-2 sentences of high-converting, clear hook copy that articulates a deep well of pain]
**The Moat**: [1-2 sentences explaining why they are defensible without relying on "first-mover advantage" or "better models"]
**The GTM**: [1-2 sentences outlining a realistic, narrow customer acquisition motion]

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
