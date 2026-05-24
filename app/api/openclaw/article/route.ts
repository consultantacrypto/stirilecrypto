import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { slugify } from '@/lib/slugify';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const SECRET_HEADER = 'x-openclaw-secret';

/** CMS table name in Supabase (not `articles`). */
const TABLE = 'stiri';

type OpenClawArticlePayload = {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url?: string;
  x_content: string;
};

function verifyOpenClawSecret(request: NextRequest): boolean {
  const expected = process.env.OPENCLAW_SECRET_KEY?.trim();
  if (!expected) return false;

  const provided = request.headers.get(SECRET_HEADER)?.trim();
  if (!provided) return false;

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  if (expectedBuf.length !== providedBuf.length) return false;

  try {
    return timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

function validatePayload(body: unknown): OpenClawArticlePayload | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid JSON body.' };
  }

  const raw = body as Record<string, unknown>;

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const content = typeof raw.content === 'string' ? raw.content.trim() : '';
  const excerpt = typeof raw.excerpt === 'string' ? raw.excerpt.trim() : '';
  const category = typeof raw.category === 'string' ? raw.category.trim() : '';
  const x_content = typeof raw.x_content === 'string' ? raw.x_content.trim() : '';
  const image_url =
    typeof raw.image_url === 'string' && raw.image_url.trim()
      ? raw.image_url.trim()
      : undefined;

  if (!title) return { error: 'Field "title" is required.' };
  if (!content) return { error: 'Field "content" is required.' };
  if (!excerpt) return { error: 'Field "excerpt" is required.' };
  if (!category) return { error: 'Field "category" is required.' };
  if (!x_content) return { error: 'Field "x_content" is required.' };

  return { title, content, excerpt, category, image_url, x_content };
}

async function resolveUniqueSlug(
  supabase: ReturnType<typeof createServiceClient>,
  title: string
): Promise<string> {
  const base = slugify(title) || `openclaw-draft`;
  let candidate = base;
  let suffix = 0;

  while (suffix < 10) {
    const { data } = await supabase
      .from(TABLE)
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();

    if (!data) return candidate;

    suffix += 1;
    candidate = `${base}-${Date.now()}-${suffix}`;
  }

  return `${base}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  if (!verifyOpenClawSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const validated = validatePayload(body);
    if ('error' in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const supabase = createServiceClient();
    const slug = await resolveUniqueSlug(supabase, validated.title);

    const row = {
      title: validated.title,
      slug,
      excerpt: validated.excerpt,
      content: validated.content,
      category: validated.category,
      status: 'draft' as const,
      image_url: validated.image_url ?? null,
      published_at: null,
      x_content: validated.x_content,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(row)
      .select('id, slug')
      .single();

    if (error) {
      console.error('[openclaw/article] insert failed:', error.message);

      if (error.message.includes('x_content')) {
        return NextResponse.json(
          {
            error:
              'Database missing column "x_content". Run supabase/x-content-schema.sql in the Supabase SQL Editor.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to save article draft.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to save article draft.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: data.id,
        slug: data.slug,
        status: 'draft',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[openclaw/article]', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
