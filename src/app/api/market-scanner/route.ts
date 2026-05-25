import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { concept, competitors, differentiation } = await req.json();

    if (!concept || typeof concept !== 'string' || concept.trim().length === 0) {
      return NextResponse.json({ error: 'Startup concept is required' }, { status: 400 });
    }

    if (concept.length > 5000) {
      return NextResponse.json({ error: 'Startup concept is too long' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
    }

    const cleanedCompetitors = typeof competitors === 'string'
      ? competitors.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
      : Array.isArray(competitors)
        ? competitors.map((c: any) => String(c).trim()).filter((c: string) => c.length > 0)
        : [];

    if (cleanedCompetitors.length === 0) {
      return NextResponse.json({ error: 'At least one competitor is required' }, { status: 400 });
    }

    const prompt = `You are Ramesh Nuti: a 2x founder (ActionEDI, Acmetek), angel investor at Svyam Ventures, and strategic startup advisor. You evaluate competitive landscapes not with generic buzzwords, but with hard-nosed tactical realism.

The user is planning a startup. Here are the details:
- **Their Concept**: "${concept.replace(/"/g, '\\"')}"
- **Their Key Competitors**: ${cleanedCompetitors.join(', ')}
- **Their Claimed Differentiator**: "${(differentiation || 'Not specified').replace(/"/g, '\\"')}"

Your task is to analyze this market segment, define the two most critical axes of competition, plot coordinate values (-5 to +5) for "Your Startup" and the competitors on a 2x2 grid, evaluate their structural vulnerabilities, identify the untapped market gap, and lay out a tactical GTM infiltration plan.

Be direct, operator-first, and highly analytical.

Your response MUST follow this exact markdown format to allow parsing:

## Axes
- **Axis X (Horizontal)**: [Low-value side (-5)] vs [High-value side (+5)]
- **Axis Y (Vertical)**: [Low-value side (-5)] vs [High-value side (+5)]

## Coordinates
- **Your Startup**: ([x_coordinate_integer], [y_coordinate_integer])
${cleanedCompetitors.map((comp) => `- **${comp}**: ([x_coordinate_integer], [y_coordinate_integer])`).join('\n')}

## Competitor Vulnerabilities
${cleanedCompetitors.map((comp, idx) => `${idx + 1}. **${comp}**
- **Incumbent Strength**: [1 sentence explaining their strongest advantage that our startup should NOT compete against directly]
- **Fatal Vulnerability**: [1-2 sentences explaining their main strategic blindspot, operational friction, or underserved segment]`).join('\n\n')}

## The White Space
[1-2 sentences detailing the exact unoccupied market gap or underserved customer need that we can claim]

## Tactical GTM Infiltration Plan
1. **[Play 1 Name]**: [1-2 sentences of high-impact, low-cost customer acquisition or product setup play to siphon customers]
2. **[Play 2 Name]**: [1-2 sentences of high-impact, low-cost customer acquisition or product setup play to siphon customers]
3. **[Play 3 Name]**: [1-2 sentences of high-impact, low-cost customer acquisition or product setup play to siphon customers]

Note on Coordinates: 
- Coordinates must be integers between -5 and +5.
- The coordinates should represent relative placement on the X and Y axes.
- "Your Startup" should ideally be placed in a favorable position (e.g. upper right or specific quadrant representing the gap), with competitors elsewhere.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
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
    console.error('Market Scanner API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
