'use server';

import { revalidatePath } from 'next/cache';
import { saveQuotes } from '@/lib/db/snapshots';
import { normalize } from '@/lib/odds/normalize';
import { fetchOdds } from '@/lib/odds/provider';

export async function refreshOdds() {
  try {
    const raw = await fetchOdds();
    const normalized = normalize(raw, new Date().toISOString());
    await saveQuotes(normalized);
    revalidatePath('/dashboard');
    return { ok: true, warning: null as string | null };
  } catch (error) {
    return { ok: false, warning: error instanceof Error ? error.message : 'Unknown fetch failure' };
  }
}
