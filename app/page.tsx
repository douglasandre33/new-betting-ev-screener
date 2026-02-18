import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-6">
      <nav className="mb-6 flex items-center justify-between rounded border border-slate-800 bg-slate-900 p-4">
        <h1 className="text-xl font-semibold">+EV Dashboard</h1>
        <Link href="/dashboard" className="rounded bg-cyan-600 px-3 py-2 text-sm font-medium">
          Open Dashboard
        </Link>
      </nav>
      <section className="rounded border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-lg font-medium">Dashboard</h2>
        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800">
              <tr><th className="p-3">League</th><th className="p-3">Event</th><th className="p-3">Market</th><th className="p-3">Selection</th><th className="p-3">Book</th><th className="p-3">Odds</th><th className="p-3">Fair Odds</th><th className="p-3">EV%</th></tr>
            </thead>
            <tbody><tr><td colSpan={8} className="p-6 text-center text-slate-400">No opportunities yet.</td></tr></tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
