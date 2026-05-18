import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type OpenClawAction = 'seo' | 'format';

type RequestBody = {
  action: OpenClawAction;
  content: string;
};

// ---------------------------------------------------------------------------
// OpenClaw configuration — insert your credentials in .env.local:
//   OPENCLAW_API_URL=https://your-openclaw-host/api/v1/chat   (your endpoint)
//   OPENCLAW_API_KEY=your-secret-api-key
// ---------------------------------------------------------------------------
const OPENCLAW_API_URL = process.env.OPENCLAW_API_URL;
const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY;

function isOpenClawConfigured(): boolean {
  return Boolean(OPENCLAW_API_URL?.trim() && OPENCLAW_API_KEY?.trim());
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function parseSeoResponse(raw: string): { metaTitle: string; metaDescription: string } | null {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      metaTitle?: string;
      meta_description?: string;
      metaDescription?: string;
      meta_title?: string;
    };
    const metaTitle = (parsed.metaTitle ?? parsed.meta_title ?? '').trim();
    const metaDescription = (
      parsed.metaDescription ?? parsed.meta_description ?? ''
    ).trim();
    if (!metaTitle || !metaDescription) return null;
    return {
      metaTitle: truncate(metaTitle, 60),
      metaDescription: truncate(metaDescription, 160),
    };
  } catch {
    return null;
  }
}

function mockSeoResponse(content: string): { metaTitle: string; metaDescription: string } {
  const plain = stripHtml(content) || 'Articole crypto și analiză de piață';
  const words = plain.split(/\s+/).filter(Boolean);
  const titleBase = words.slice(0, 8).join(' ') || 'Știri Crypto — analiză de piață';
  const descBase =
    words.slice(0, 24).join(' ') ||
    'Descoperă analize crypto, context macro și perspective on-chain de la Știrile Crypto.';

  return {
    metaTitle: truncate(`${titleBase} | Știrile Crypto`, 60),
    metaDescription: truncate(
      `${descBase} Citește analiza completă pe stirilecrypto.ro.`,
      160
    ),
  };
}

function mockFormatResponse(content: string): string {
  const plain = stripHtml(content) || content;
  if (!plain.trim()) return content;

  return plain
    .replace(/\s+/g, ' ')
    .replace(/\. /g, '. ')
    .trim()
    .replace(/^(.)/, (m) => m.toUpperCase());
}

const SEO_SYSTEM_PROMPT = `Ești OpenClaw, asistent editorial SEO pentru un site de știri crypto în limba română.
Generează un Meta Title click-worthy (maxim 60 caractere) și o Meta Description pentru Google (maxim 160 caractere).
Răspunde DOAR cu JSON valid, fără markdown:
{"metaTitle":"...","metaDescription":"..."}`;

const FORMAT_SYSTEM_PROMPT = `Ești OpenClaw, editor senior de jurnalism crypto în limba română.
Rescrie și rafinează textul primit într-un ton premium, profesionist, clar și captivant — stil publicație financiară de top.
Păstrează sensul factual. Returnează DOAR textul final polizat, fără explicații sau prefixe.`;

async function callOpenClaw(systemPrompt: string, userContent: string): Promise<string> {
  if (!isOpenClawConfigured()) {
    throw new Error('OPENCLAW_NOT_CONFIGURED');
  }

  // ---------------------------------------------------------------------------
  // OpenClaw API request — adjust headers/body to match your OpenClaw contract.
  // Example below assumes an OpenAI-compatible chat completions endpoint.
  // ---------------------------------------------------------------------------
  const response = await fetch(OPENCLAW_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENCLAW_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenClaw API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    output?: string;
    text?: string;
    content?: string;
  };

  return (
    data.choices?.[0]?.message?.content ??
    data.output ??
    data.text ??
    data.content ??
    ''
  ).trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { action, content } = body;

    if (!action || (action !== 'seo' && action !== 'format')) {
      return NextResponse.json(
        { error: 'Invalid action. Use "seo" or "format".' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    const plainContent = stripHtml(content);

    if (action === 'seo') {
      if (!isOpenClawConfigured()) {
        const mock = mockSeoResponse(plainContent);
        return NextResponse.json({
          ...mock,
          mock: true,
        });
      }

      try {
        const raw = await callOpenClaw(
          SEO_SYSTEM_PROMPT,
          `Conținut articol:\n\n${plainContent.slice(0, 6000)}`
        );
        const parsed = parseSeoResponse(raw);
        if (parsed) {
          return NextResponse.json(parsed);
        }
        return NextResponse.json(mockSeoResponse(plainContent), { mock: true });
      } catch {
        return NextResponse.json(mockSeoResponse(plainContent), { mock: true });
      }
    }

    // action === 'format'
    if (!isOpenClawConfigured()) {
      return NextResponse.json({
        text: mockFormatResponse(plainContent),
        mock: true,
      });
    }

    try {
      const polished = await callOpenClaw(
        FORMAT_SYSTEM_PROMPT,
        plainContent.slice(0, 8000)
      );
      return NextResponse.json({
        text: polished || mockFormatResponse(plainContent),
      });
    } catch {
      return NextResponse.json({
        text: mockFormatResponse(plainContent),
        mock: true,
      });
    }
  } catch (err) {
    console.error('[openclaw]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'OpenClaw request failed.' },
      { status: 500 }
    );
  }
}
