import { prisma } from '@/lib/prisma';
import type { CanonicalQuote } from '@/lib/odds/types';
import {
  BOOK_WEIGHTS,
  americanToImpliedProbability,
  calculateEvPercent,
  fairProbabilityToAmerican,
  removeVigTwoWay,
  weightedBlendProbabilities,
} from '@/lib/math/odds';

export type OpportunityDetailBook = {
  book: string;
  odds: number;
  impliedPreVig: number;
  impliedPostVig: number;
  effectiveWeight: number;
};

export type Opportunity = {
  key: string;
  league: string;
  event: string;
  market: string;
  selection: string;
  book: string;
  odds: number;
  fairOdds: number;
  fairProbability: number;
  evPercent: number;
  updated: string;
  details: OpportunityDetailBook[];
};

export async function saveQuotes(quotes: CanonicalQuote[]): Promise<void> {
  for (const q of quotes) {
    const event = await prisma.event.upsert({
      where: { canonicalId: q.eventId },
      update: { league: q.league, sport: q.sport },
      create: {
        canonicalId: q.eventId,
        league: q.league,
        sport: q.sport,
        homeTeam: q.eventName.split('@')[1]?.trim() ?? q.eventName,
        awayTeam: q.eventName.split('@')[0]?.trim() ?? q.eventName,
        commenceTime: new Date(),
      },
    });

    const canonicalKey = `${q.league}:${q.eventId}:${q.marketType}:${q.line ?? 'na'}:${q.selection}`;
    const market = await prisma.market.upsert({
      where: { canonicalKey },
      update: {},
      create: { eventId: event.id, marketType: q.marketType, line: q.line, selection: q.selection, canonicalKey },
    });

    const book = await prisma.book.upsert({
      where: { key: q.bookKey },
      update: { name: q.bookName },
      create: { key: q.bookKey, name: q.bookName },
    });

    await prisma.oddsSnapshot.create({
      data: {
        bookId: book.id,
        marketId: market.id,
        snapshotTime: new Date(q.snapshotTime),
        americanOdds: q.americanOdds,
        decimalOdds: q.americanOdds > 0 ? q.americanOdds / 100 + 1 : 100 / Math.abs(q.americanOdds) + 1,
        impliedProb: americanToImpliedProbability(q.americanOdds),
      },
    });
  }
}

export async function getOpportunities(minEvPercent: number): Promise<Opportunity[]> {
  const latest = await prisma.oddsSnapshot.findMany({
    orderBy: { snapshotTime: 'desc' },
    include: { book: true, market: { include: { event: true } } },
    take: 20000,
  });

  const grouped = new Map<string, typeof latest>();
  for (const row of latest) {
    const arr = grouped.get(row.market.canonicalKey) ?? [];
    if (!arr.find((existing) => existing.bookId === row.bookId)) arr.push(row);
    grouped.set(row.market.canonicalKey, arr);
  }

  const out: Opportunity[] = [];
  for (const [key, rows] of grouped.entries()) {
    const weightedRows = rows.filter((r) => BOOK_WEIGHTS[r.book.key] !== undefined);
    if (weightedRows.length === 0) continue;
    const weightedInputs = weightedRows.map((row) => ({ bookKey: row.book.key, probability: americanToImpliedProbability(row.americanOdds) }));

    let fairProbability = 0;
    try {
      fairProbability = weightedBlendProbabilities(weightedInputs);
    } catch {
      continue;
    }

    const vigFree = removeVigTwoWay(fairProbability, 1 - fairProbability);
    fairProbability = vigFree.outcomeA;

    const totalWeight = weightedRows.reduce((acc, r) => acc + BOOK_WEIGHTS[r.book.key], 0);
    const detailBooks: OpportunityDetailBook[] = weightedRows.map((r) => ({
      book: r.book.name,
      odds: r.americanOdds,
      impliedPreVig: americanToImpliedProbability(r.americanOdds),
      impliedPostVig: fairProbability,
      effectiveWeight: BOOK_WEIGHTS[r.book.key] / totalWeight,
    }));

    for (const row of rows) {
      const ev = calculateEvPercent(fairProbability, row.americanOdds) * 100;
      if (ev >= minEvPercent) {
        out.push({
          key: `${key}:${row.bookId}`,
          league: row.market.event.league,
          event: `${row.market.event.awayTeam} @ ${row.market.event.homeTeam}`,
          market: row.market.marketType,
          selection: row.market.selection,
          book: row.book.name,
          odds: row.americanOdds,
          fairOdds: fairProbabilityToAmerican(fairProbability),
          fairProbability,
          evPercent: ev,
          updated: row.snapshotTime.toISOString(),
          details: detailBooks,
        });
      }
    }
  }
  return out.sort((a, b) => b.evPercent - a.evPercent);
}
