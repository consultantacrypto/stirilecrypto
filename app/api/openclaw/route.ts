import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/json-ld';

const CANONICAL_HOST = new URL(SITE_URL).host;

export const dynamic = 'force-dynamic';

/**
 * OpenClaw API Bridge — Next.js Admin Panel ↔ isolated Docker agent.
 *
 * This route does NOT import anything from `openclaw-agent/` (strict separation).
 * It proxies requests to the local OpenClaw Gateway container.
 *
 * Gateway (Docker): http://127.0.0.1:18789  (localhost-only bind in docker-compose)
 * Override for remote agent host: OPENCLAW_GATEWAY_URL in .env.local
 *
 * POST body examples:
 *   { "action": "seo",    "content": "<p>HTML sau text articol...</p>" }
 *   { "action": "format", "content": "text selectat din editor" }
 *   { "action": "draft",  "content": "brief sau markdown", "title": "...", "excerpt": "..." }
 *
 * Responses:
 *   seo    → { metaTitle, metaDescription }
 *   format → { text }
 *   draft  → { id, slug, status: "draft" }
 */
const OPENCLAW_GATEWAY_URL =
  process.env.OPENCLAW_GATEWAY_URL?.replace(/\/$/, '') || 'http://127.0.0.1:18789';

const GATEWAY_RUN_PATH = '/v1/run';

type OpenClawAction = 'seo' | 'format' | 'draft';

type RequestBody = {
  action: OpenClawAction;
  content: string;
  title?: string;
  excerpt?: string;
  category?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function mockSeo(content: string) {
  const plain = stripHtml(content) || 'Articole crypto și analiză de piață';
  const words = plain.split(/\s+/).filter(Boolean);
  const titleBase = words.slice(0, 8).join(' ') || 'Știri Crypto — analiză de piață';
  const descBase =
    words.slice(0, 24).join(' ') ||
    'Descoperă analize crypto, context macro și perspective on-chain.';

  return {
    metaTitle: truncate(`${titleBase} | Știrile Crypto`, 60),
    metaDescription: truncate(
      `${descBase} Citește analiza completă pe ${CANONICAL_HOST}.`,
      160
    ),
    mock: true,
    gatewayUnreachable: true,
  };
}

function mockFormat(content: string) {
  const plain = stripHtml(content) || content;
  return {
    text: plain.trim() ? plain.charAt(0).toUpperCase() + plain.slice(1) : content,
    mock: true,
    gatewayUnreachable: true,
  };
}

async function proxyToGateway(body: RequestBody): Promise<{
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}${GATEWAY_RUN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    const res = await fetch(`${OPENCLAW_GATEWAY_URL}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({
      bridge: 'ok',
      gateway: res.ok ? data : { status: 'unreachable', gateway: OPENCLAW_GATEWAY_URL },
    });
  } catch {
    return NextResponse.json(
      {
        bridge: 'ok',
        gateway: {
          status: 'unreachable',
          url: OPENCLAW_GATEWAY_URL,
          hint: 'Start agent: cd openclaw-agent && docker compose up -d',
        },
      },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { action, content } = body;

    if (!action || !['seo', 'format', 'draft'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "seo", "format", or "draft".' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    try {
      const { ok, status, data } = await proxyToGateway(body);

      if (ok) {
        return NextResponse.json(data, { status: status === 201 ? 201 : 200 });
      }

      if (action === 'seo') {
        return NextResponse.json(mockSeo(content), { status: 200 });
      }
      if (action === 'format') {
        return NextResponse.json(mockFormat(content), { status: 200 });
      }

      return NextResponse.json(
        {
          error:
            (data.error as string) ||
            'OpenClaw gateway error. Verifică docker compose și .env din openclaw-agent.',
          ...data,
        },
        { status: status >= 400 ? status : 503 }
      );
    } catch {
      if (action === 'seo') {
        return NextResponse.json(mockSeo(content));
      }
      if (action === 'format') {
        return NextResponse.json(mockFormat(content));
      }

      return NextResponse.json(
        {
          error:
            'OpenClaw gateway unreachable. Rulează: cd openclaw-agent && docker compose up -d',
          gateway: OPENCLAW_GATEWAY_URL,
        },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error('[openclaw bridge]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'OpenClaw bridge failed.' },
      { status: 500 }
    );
  }
}
