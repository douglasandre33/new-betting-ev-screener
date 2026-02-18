import { BOOK_ALIASES, SUPPORTED_LEAGUES } from '@/lib/odds/config';
import type { CanonicalQuote, RawEvent } from '@/lib/odds/types';

const toMarketType = (k: string): CanonicalQuote['marketType'] | null => {
  if (k === 'h2h') return 'moneyline';
  if (k === 'spreads') return 'spread';
  if (k === 'totals') return 'total';
  return null;
};

export function normalize(raw: RawEvent[], snapshotTime: string): CanonicalQuote[] {
  const quotes: CanonicalQuote[] = [];
  for (const event of raw) {
    if (!SUPPORTED_LEAGUES.has(event.sport_key)) continue;
    for (const book of event.bookmakers) {
      const mapped = BOOK_ALIASES[book.key];
      if (!mapped) continue;
      for (const market of book.markets) {
        const type = toMarketType(market.key);
        if (!type) continue;
        if (type === 'moneyline' && event.sport_key.startsWith('soccer') && market.outcomes.length === 3) continue;
        const outcomes = market.outcomes.slice(0, 2);
        for (const outcome of outcomes) {
          quotes.push({
            league: event.sport_key,
            sport: event.sport_title,
            eventId: event.id,
            eventName: `${event.away_team} @ ${event.home_team}`,
            marketType: type,
            line: outcome.point ?? null,
            selection: outcome.name,
            bookKey: mapped,
            bookName: book.title,
            americanOdds: outcome.price,
            snapshotTime,
          });
        }
      }
    }
  }
  return quotes;
}
