export type RawOutcome = { name: string; price: number; point?: number };
export type RawMarket = { key: string; outcomes: RawOutcome[] };
export type RawBook = { key: string; title: string; markets: RawMarket[] };
export type RawEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: RawBook[];
};

export type CanonicalQuote = {
  league: string;
  sport: string;
  eventId: string;
  eventName: string;
  marketType: 'moneyline' | 'spread' | 'total';
  line: number | null;
  selection: string;
  bookKey: string;
  bookName: string;
  americanOdds: number;
  snapshotTime: string;
};
