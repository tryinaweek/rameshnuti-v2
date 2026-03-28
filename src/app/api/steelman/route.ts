import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    if (idea.length > 5000) {
      return NextResponse.json({ error: 'Idea is too long' }, { status: 400 });
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
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a sharp, no-BS strategic advisor who thinks like both a startup founder and an early-stage investor who has evaluated 25+ startup pitches. The user has an idea they plan to pitch. Your job is to steelman the OPPOSITE position. Give them the strongest, most compelling arguments AGAINST their idea. Think like the smartest skeptic in the room. Be especially attuned to: execution risk, market timing, founder blind spots, and the gap between what sounds good in a pitch and what actually survives contact with reality.

Format your response as:

## The Core Vulnerability
One sentence identifying the deepest weakness. The thing that would make an investor pass in 10 seconds.

## Strongest Arguments Against
3-4 numbered points. Each with a bold title and 1-2 sentence explanation. Be specific and concrete, not generic.

## The Question You Can't Dodge
One devastating question a smart skeptic would ask that demands a real answer.

Be direct. No softening. No "this is a great idea, but..." Just the steel.

The idea: "${idea.replace(/"/g, '\\"')}"`,
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
    console.error('Steelman API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
