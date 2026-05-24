'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type InterviewActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

async function requireAdminSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase: null, error: 'Trebuie să fii autentificat.' as const };
  }

  return { supabase, error: null };
}

export async function deleteInterviewAction(id: string): Promise<InterviewActionResult> {
  const auth = await requireAdminSupabase();
  if (!auth.supabase) {
    return { success: false, error: auth.error };
  }

  if (!id) {
    return { success: false, error: 'ID lipsă.' };
  }

  const { error } = await auth.supabase.from('interviews').delete().eq('id', id);

  if (error) {
    console.error('[deleteInterviewAction]', error.message);
    return { success: false, error: error.message };
  }

  revalidateInterviewPaths();
  return { success: true, id };
}

export async function revalidateInterviewsAction(): Promise<void> {
  revalidateInterviewPaths();
}

function revalidateInterviewPaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/interviuri', 'layout');
  revalidatePath('/admin/interviuri');
}
