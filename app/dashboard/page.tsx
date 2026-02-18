import { refreshOdds } from '@/app/actions/refresh';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { LiveRefreshWarning } from '@/components/dashboard/live-refresh';
import { getOpportunities } from '@/lib/db/snapshots';

export default async function DashboardPage() {
  const minEv = Number(process.env.MIN_EV_PERCENT ?? '1');
  const rows = await getOpportunities(minEv);

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6">
      <nav className="mb-6 flex items-center justify-between rounded border border-slate-800 bg-slate-900 p-4">
        <h1 className="text-xl font-semibold">+EV Dashboard</h1>
        <form action={refreshOdds}><button className="rounded bg-cyan-600 px-3 py-2 text-sm font-medium">Refresh odds now</button></form>
      </nav>
      <LiveRefreshWarning />
      <section className="mb-4 rounded border border-cyan-700 bg-cyan-950/30 p-3 text-sm text-cyan-200">Fair odds source: Weighted blend</section>
      <DashboardClient rows={rows} />
    </main>
  );
}
