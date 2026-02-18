export const SUPPORTED_LEAGUES = new Set([
  'americanfootball_nfl',
  'basketball_nba',
  'icehockey_nhl',
  'americanfootball_ncaaf',
  'basketball_ncaab',
  'baseball_ncaa',
  'soccer_epl',
  'soccer_spain_la_liga',
  'soccer_italy_serie_a',
  'soccer_germany_bundesliga',
  'soccer_france_ligue_one',
  'soccer_uefa_champs_league',
]);

export const BOOK_ALIASES: Record<string, string> = {
  pinnacle: 'pinnacle',
  circa: 'circa',
  betcris: 'bookmaker',
  bookmaker: 'bookmaker',
  draftkings: 'draftkings',
  fanduel: 'fanduel',
  betmgm: 'betmgm',
};
