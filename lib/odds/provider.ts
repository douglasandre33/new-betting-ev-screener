import type { RawEvent } from '@/lib/odds/types';

export async function fetchOdds(): Promise<RawEvent[]> {
  const key = process.env.ODDS_API_KEY;
  if (!key || process.env.DEMO_MODE === 'true') {
    const demo = await import('@/scripts/demo-fixture.json');
    return demo.default as RawEvent[];
  }

  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=us&markets=h2h,spreads,totals&oddsFormat=american&bookmakers=pinnacle,circa,betcris,draftkings,fanduel,betmgm&apiKey=${key}`;
  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`Odds API failed: ${response.status}`);
  return (await response.json()) as RawEvent[];
}
