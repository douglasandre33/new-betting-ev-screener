import { NextResponse } from 'next/server';
import { refreshOdds } from '@/app/actions/refresh';

let lastRefreshAt = 0;

export async function POST() {
  const now = Date.now();
  if (now - lastRefreshAt < 15000) {
    return NextResponse.json({ ok: false, warning: 'Rate limited. Please wait 15s.' }, { status: 429 });
  }
  lastRefreshAt = now;

  const result = await refreshOdds();
  if (!result.ok) {
    console.warn('[refresh] failed', result.warning);
  } else {
    console.info('[refresh] success');
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
