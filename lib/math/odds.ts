export const BOOK_WEIGHTS: Record<string, number> = {
  pinnacle: 0.3,
  circa: 0.25,
  bookmaker: 0.2,
  draftkings: 0.1,
  fanduel: 0.1,
  betmgm: 0.05,
};

export function americanToImpliedProbability(odds: number): number {
  if (odds === 0) throw new Error('American odds cannot be 0');
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

export function americanToPayoutMultiplier(odds: number): number {
  if (odds === 0) throw new Error('American odds cannot be 0');
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
}

export function removeVigTwoWay(a: number, b: number): { outcomeA: number; outcomeB: number } {
  const sum = a + b;
  if (sum <= 0) throw new Error('Invalid vig inputs');
  return { outcomeA: a / sum, outcomeB: b / sum };
}

export function weightedBlendProbabilities(inputs: Array<{ bookKey: string; probability: number }>): number {
  const eligible = inputs.filter((i) => BOOK_WEIGHTS[i.bookKey] !== undefined);
  const totalWeight = eligible.reduce((acc, i) => acc + BOOK_WEIGHTS[i.bookKey], 0);
  if (totalWeight === 0) throw new Error('No weighted books available');
  return eligible.reduce((acc, i) => acc + (BOOK_WEIGHTS[i.bookKey] / totalWeight) * i.probability, 0);
}

export function renormalizeOutcomes(outcomes: number[]): number[] {
  const total = outcomes.reduce((acc, value) => acc + value, 0);
  if (total <= 0) throw new Error('Invalid outcomes');
  return outcomes.map((value) => value / total);
}

export function fairProbabilityToAmerican(probability: number): number {
  if (probability <= 0 || probability >= 1) throw new Error('Invalid fair probability');
  if (probability >= 0.5) return Math.round(-(probability / (1 - probability)) * 100);
  return Math.round(((1 - probability) / probability) * 100);
}

export function calculateEvPercent(fairProbability: number, americanOdds: number): number {
  return fairProbability * americanToPayoutMultiplier(americanOdds) - 1;
}
