import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminSession } from '@/lib/auth/admin';
import { handleInquiryDeliveryRequest } from '@/lib/admin/inquiry-delivery';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Admin-only delivery flag. product_inquiries has no UPDATE policy for
 * authenticated users; this uses the service role only after isAdminSession.
 * Do not add an UPDATE policy here — that would widen RLS.
 */
export async function POST(request: NextRequest) {
  const result = await handleInquiryDeliveryRequest({
    isAdmin: async () => {
      try {
        const supabase = await createClient();
        return await isAdminSession(supabase);
      } catch {
        return false;
      }
    },
    readBody: () => request.json(),
    write: async (id, patch) => {
      const service = createServiceClient();
      const { data, error } = await service
        .from('product_inquiries')
        .update(patch)
        .eq('id', id)
        .select('id, delivery_status, delivered_at')
        .maybeSingle();

      if (error) {
        console.error('[POST /api/admin/comenzi/livrare]', error.code ?? '', error.message);
      }

      return {
        data: data
          ? {
              id: String(data.id),
              delivery_status: String(data.delivery_status),
              delivered_at: data.delivered_at == null ? null : String(data.delivered_at),
            }
          : null,
        error: error ? { message: error.message, code: error.code } : null,
      };
    },
  });

  if (result.status === 200) {
    revalidatePath('/admin/comenzi');
  }

  return NextResponse.json(result.body, {
    status: result.status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
