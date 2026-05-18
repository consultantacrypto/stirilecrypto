import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    let slug: string | undefined;

    try {
      const body = (await request.json()) as { slug?: unknown };
      if (typeof body.slug === 'string' && body.slug.trim()) {
        slug = body.slug.trim();
      }
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = await createClient();

    const { error: rpcError } = await supabase.rpc('increment_article_views', {
      article_slug: slug,
    });

    if (!rpcError) {
      return NextResponse.json({ ok: true });
    }

    // Fallback when RPC is not deployed yet
    const { data, error: fetchError } = await supabase
      .from('stiri')
      .select('views')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (fetchError || !data) {
      return NextResponse.json({ ok: true });
    }

    const currentViews =
      typeof data.views === 'number' ? data.views : Number(data.views ?? 0);

    await supabase
      .from('stiri')
      .update({ views: currentViews + 1 })
      .eq('slug', slug)
      .eq('status', 'published');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[views]', err);
    return NextResponse.json({ ok: true });
  }
}
