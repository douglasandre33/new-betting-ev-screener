'use client';

import { useMemo, useState } from 'react';
import type { Opportunity } from '@/lib/db/snapshots';

type Props = { rows: Opportunity[] };
type Columns = Record<'league' | 'event' | 'market' | 'selection' | 'book' | 'odds' | 'fairOdds' | 'evPercent' | 'updated', boolean>;

const DEFAULT_COLUMNS: Columns = { league: true, event: true, market: true, selection: true, book: true, odds: true, fairOdds: true, evPercent: true, updated: true };

function getStoredColumns(): Columns {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;
  const raw = window.localStorage.getItem('ev_columns');
  if (!raw) return DEFAULT_COLUMNS;
  return JSON.parse(raw) as Columns;
}

export function DashboardClient({ rows }: Props) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState<Columns>(getStoredColumns);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filtered = useMemo(() => rows.filter((r) => `${r.event} ${r.league} ${r.book}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);

  const pageSize = 100;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selected = filtered.find((r) => r.key === selectedKey) ?? null;

  const toggle = (k: keyof Columns) => {
    const next = { ...columns, [k]: !columns[k] };
    setColumns(next);
    window.localStorage.setItem('ev_columns', JSON.stringify(next));
  };

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="rounded border border-slate-700 bg-slate-950 p-2" placeholder="Search team/event" />
        <div className="flex flex-wrap gap-2 text-xs">
          {(Object.keys(columns) as Array<keyof Columns>).map((k) => (
            <label key={k} className="flex items-center gap-1"><input type="checkbox" checked={columns[k]} onChange={() => toggle(k)} />{k}</label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800"><tr>{columns.league && <th className="p-3">League</th>}{columns.event && <th className="p-3">Event</th>}{columns.market && <th className="p-3">Market</th>}{columns.selection && <th className="p-3">Selection</th>}{columns.book && <th className="p-3">Book</th>}{columns.odds && <th className="p-3">Odds</th>}{columns.fairOdds && <th className="p-3">Fair Odds</th>}{columns.evPercent && <th className="p-3">EV%</th>}{columns.updated && <th className="p-3">Updated</th>}</tr></thead>
          <tbody>
            {paged.length === 0 ? <tr><td className="p-6 text-center text-slate-400" colSpan={9}>No opportunities yet.</td></tr> : paged.map((row) => (
              <tr key={row.key} className="cursor-pointer border-t border-slate-800" onClick={() => setSelectedKey(row.key)}>
                {columns.league && <td className="p-3">{row.league}</td>}{columns.event && <td className="p-3">{row.event}</td>}{columns.market && <td className="p-3">{row.market}</td>}{columns.selection && <td className="p-3">{row.selection}</td>}{columns.book && <td className="p-3">{row.book}</td>}{columns.odds && <td className="p-3">{row.odds}</td>}{columns.fairOdds && <td className="p-3">{row.fairOdds}</td>}{columns.evPercent && <td className="p-3">{row.evPercent.toFixed(2)}%</td>}{columns.updated && <td className="p-3">{new Date(row.updated).toLocaleString()}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button className="rounded border border-slate-700 px-3 py-1" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span>Page {page}/{totalPages} ({filtered.length} rows)</span>
        <button className="rounded border border-slate-700 px-3 py-1" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>

      {selected && (
        <aside className="fixed right-0 top-0 h-screen w-full max-w-md overflow-y-auto border-l border-slate-700 bg-slate-900 p-4">
          <button className="mb-3 rounded border border-slate-700 px-2 py-1" onClick={() => setSelectedKey(null)}>Close</button>
          <h3 className="text-lg font-semibold">Opportunity details</h3>
          <p className="mb-2 text-sm text-slate-300">{selected.event} · {selected.market} · {selected.selection}</p>
          <p className="text-sm">Blended fair probability: {(selected.fairProbability * 100).toFixed(2)}%</p>
          <p className="mb-3 text-sm">Blended fair odds: {selected.fairOdds}</p>
          <table className="w-full text-xs">
            <thead><tr><th className="text-left">Book</th><th>Odds</th><th>Implied (pre)</th><th>Post-vig</th><th>Eff. wt</th></tr></thead>
            <tbody>
              {selected.details.map((d) => (
                <tr key={`${selected.key}-${d.book}`} className="border-t border-slate-800"><td>{d.book}</td><td className="text-center">{d.odds}</td><td className="text-center">{(d.impliedPreVig * 100).toFixed(2)}%</td><td className="text-center">{(d.impliedPostVig * 100).toFixed(2)}%</td><td className="text-center">{(d.effectiveWeight * 100).toFixed(1)}%</td></tr>
              ))}
            </tbody>
          </table>
        </aside>
      )}
    </>
  );
}
