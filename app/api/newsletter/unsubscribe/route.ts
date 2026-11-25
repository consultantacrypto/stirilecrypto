import { createServiceClient } from '@/lib/supabase/service';
import { createUnsubscribeStore } from '@/lib/newsletter/store';
import {
  confirmUnsubscribe,
  handleUnsubscribePost,
  methodNotAllowed,
  readUnsubscribeSecret,
} from '@/lib/newsletter/unsubscribe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return methodNotAllowed();
}

export async function POST(request: Request) {
  const secret = readUnsubscribeSecret();
  return handleUnsubscribePost(request, {
    secret,
    perform: (token) =>
      confirmUnsubscribe({
        token,
        secret,
        getStore: () => createUnsubscribeStore(createServiceClient()),
      }),
  });
}
