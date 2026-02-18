import { describe, expect, test } from 'vitest';
import { americanToImpliedProbability, americanToPayoutMultiplier, calculateEvPercent, fairProbabilityToAmerican, removeVigTwoWay, renormalizeOutcomes, weightedBlendProbabilities } from '@/lib/math/odds';

describe('odds math', () => {
  test('americanToImpliedProbability', () => {
    expect(americanToImpliedProbability(-110)).toBeCloseTo(0.5238, 3);
    expect(americanToImpliedProbability(150)).toBeCloseTo(0.4, 3);
  });

  test('americanToPayoutMultiplier', () => {
    expect(americanToPayoutMultiplier(150)).toBeCloseTo(2.5, 3);
  });

  test('removeVigTwoWay', () => {
    const out = removeVigTwoWay(0.5238, 0.5238);
    expect(out.outcomeA).toBeCloseTo(0.5, 3);
  });

  test('weighted blend renormalizes missing books', () => {
    const out = weightedBlendProbabilities([
      { bookKey: 'pinnacle', probability: 0.51 },
      { bookKey: 'fanduel', probability: 0.49 },
    ]);
    expect(out).toBeCloseTo(0.505, 2);
  });

  test('renormalizeOutcomes', () => {
    const out = renormalizeOutcomes([0.2, 0.2]);
    expect(out[0]).toBe(0.5);
  });

  test('fairProbabilityToAmerican', () => {
    expect(fairProbabilityToAmerican(0.4)).toBe(150);
  });

  test('calculateEvPercent', () => {
    expect(calculateEvPercent(0.5, 110)).toBeCloseTo(0.05, 2);
  });
});
