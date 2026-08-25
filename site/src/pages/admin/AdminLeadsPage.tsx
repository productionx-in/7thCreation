import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Lead, type LeadStatus } from '@/lib/supabase';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: 'text-[#C6A15B]',
  contacted: 'text-[#E6DECD]',
  quoted: 'text-[#8FB4C6]',
  won: 'text-[#7FBF7F]',
  lost: 'text-[#767F83]',
};

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setLeads(data ?? []));
  };

  useEffect(load, []);

  const updateStatus = async (lead: Lead, status: LeadStatus) => {
    setBusyId(lead.id);
    await supabase.from('leads').update({ status }).eq('id', lead.id);
    setBusyId(null);
    load();
  };

  const visible = leads?.filter((l) => filter === 'all' || l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-[#E6DECD]">Leads</h1>
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#767F83]/20 p-1 text-xs">
          {(['all', ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 uppercase tracking-wider transition-colors ${
                filter === s ? 'bg-[#C6A15B] text-[#11151A]' : 'text-[#767F83] hover:text-[#E6DECD]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
        {leads === null && <p className="py-6 text-sm text-[#767F83]">Loading…</p>}
        {visible?.length === 0 && <p className="py-6 text-sm text-[#767F83]">No leads here yet.</p>}
        {visible?.map((lead) => (
          <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="text-sm text-[#E6DECD]">
                {lead.name} <span className="text-[#767F83]">· {lead.phone}</span>
              </p>
              <p className="mt-0.5 text-xs text-[#767F83]">
                {lead.service ?? 'No service specified'}
                {lead.location ? ` · ${lead.location}` : ''} ·{' '}
                {new Date(lead.created_at).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                disabled={busyId === lead.id}
                value={lead.status}
                onChange={(e) => updateStatus(lead, e.target.value as LeadStatus)}
                className={`rounded-full border border-[#767F83]/30 bg-transparent px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-50 ${STATUS_COLOR[lead.status]}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-ink text-[#E6DECD]">
                    {s}
                  </option>
                ))}
              </select>
              <Link
                to={`/admin/quotations/new?leadId=${lead.id}`}
                className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
              >
                Quote →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
