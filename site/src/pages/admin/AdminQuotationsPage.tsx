import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Quotation } from '@/lib/supabase';

const STATUS_COLOR: Record<string, string> = {
  draft: 'text-[#767F83]',
  sent: 'text-[#C6A15B]',
  accepted: 'text-[#7FBF7F]',
  rejected: 'text-[#B6421D]',
};

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[] | null>(null);

  useEffect(() => {
    supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setQuotations(data ?? []));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-[#E6DECD]">Quotations</h1>
        <Link
          to="/admin/quotations/new"
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          New quotation
        </Link>
      </div>

      <div className="mt-8 divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
        {quotations === null && <p className="py-6 text-sm text-[#767F83]">Loading…</p>}
        {quotations?.length === 0 && (
          <p className="py-6 text-sm text-[#767F83]">No quotations yet — create your first one.</p>
        )}
        {quotations?.map((q) => (
          <Link
            key={q.id}
            to={`/admin/quotations/${q.id}`}
            className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-[#E6DECD]/[0.03]"
          >
            <div className="min-w-0">
              <p className="text-sm text-[#E6DECD]">
                {q.quotation_number} <span className="text-[#767F83]">· {q.client_name}</span>
              </p>
              <p className="mt-0.5 text-xs text-[#767F83]">
                {q.project_title || 'Untitled project'} · {new Date(q.issue_date).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#E6DECD]">{formatINR(q.total)}</span>
              <span className={`text-xs uppercase tracking-widest ${STATUS_COLOR[q.status]}`}>{q.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
