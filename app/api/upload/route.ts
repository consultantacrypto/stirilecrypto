import { NextResponse } from 'next/server';
import { uploadImageToStorage } from '@/lib/storage/upload-image';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Fișier lipsă sau invalid.' }, { status: 400 });
    }

    const url = await uploadImageToStorage(file);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[api/upload]', err);
    const message = err instanceof Error ? err.message : 'Upload eșuat.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
