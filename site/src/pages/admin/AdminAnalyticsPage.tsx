import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ViewRow {
  path: string;
  session_id: string;
  created_at: string;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function AdminAnalyticsPage() {
  const [rows, setRows] = useState<ViewRow[] | null>(null);
  const [liveCount, setLiveCount] = useState(0);

  const loadRange = () => {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    supabase
      .from('page_views')
      .select('path, session_id, created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })
      .then(({ data }) => setRows(data ?? []));
  };

  const loadLive = () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', fiveMinAgo)
      .then(({ data }) => setLiveCount(new Set((data ?? []).map((r) => r.session_id)).size));
  };

  useEffect(() => {
    loadRange();
    loadLive();
    const interval = setInterval(loadLive, 20000);
    return () => clearInterval(interval);
  }, []);

  if (rows === null) return <p className="text-sm text-[#767F83]">Loading…</p>;

  const now = new Date();
  const todayStart = startOfDay(now);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const viewsToday = rows.filter((r) => new Date(r.created_at) >= todayStart).length;
  const viewsLast7 = rows.filter((r) => new Date(r.created_at) >= sevenDaysAgo).length;
  const viewsLast30 = rows.length;
  const uniqueSessions30 = new Set(rows.map((r) => r.session_id)).size;

  const pathCounts = new Map<string, number>();
  for (const r of rows) pathCounts.set(r.path, (pathCounts.get(r.path) ?? 0) + 1);
  const topPages = [...pathCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const days: { key: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    days.push({ key, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), count: 0 });
  }
  const dayIndex = new Map(days.map((d, i) => [d.key, i]));
  for (const r of rows) {
    const key = dateKey(new Date(r.created_at));
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].count++;
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div>
      <h1 className="font-display text-2xl text-[#E6DECD]">Analytics</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile label="Live now" value={liveCount} accent />
        <StatTile label="Today" value={viewsToday} />
        <StatTile label="Last 7 days" value={viewsLast7} />
        <StatTile label="Last 30 days" value={viewsLast30} />
        <StatTile label="Unique visitors (30d)" value={uniqueSessions30} />
      </div>

      <div className="mt-10">
        <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Views, last 14 days</p>
        <div className="flex h-32 items-end gap-1.5 border-b border-[#767F83]/20 pb-1">
          {days.map((d) => (
            <div key={d.key} className="group relative flex-1" title={`${d.label}: ${d.count} views`}>
              <div
                className="mx-auto w-full rounded-t bg-[#C6A15B] transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.max(2, (d.count / maxCount) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 text-[0.6rem] text-[#767F83]">
          {days.map((d, i) => (
            <div key={d.key} className="flex-1 text-center">
              {i % 2 === 0 ? d.label : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Top pages (last 30 days)</p>
        <div className="divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
          {topPages.length === 0 && <p className="py-4 text-sm text-[#767F83]">No traffic recorded yet.</p>}
          {topPages.map(([path, count]) => (
            <div key={path} className="flex items-center justify-between py-3 text-sm">
              <span className="text-[#E6DECD]">{path}</span>
              <span className="text-[#767F83]">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-[#767F83]">
        Counts every page load on the public site (blog and admin excluded). "Live now" is sessions with a page
        view in the last 5 minutes, refreshed every 20 seconds.
      </p>
    </div>
  );
}

function StatTile({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-[#767F83]/20 p-4">
      <p className={`font-display text-2xl ${accent ? 'text-[#C6A15B]' : 'text-[#E6DECD]'}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-[#767F83]">{label}</p>
    </div>
  );
}
