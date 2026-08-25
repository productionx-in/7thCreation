import { useEffect, useState, type FormEvent } from 'react';
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

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

function AddLeadForm({ onAdded, onCancel }: { onAdded: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('leads').insert({
      name,
      phone,
      email: email || null,
      service: service || null,
      location: location || null,
      details: details || null,
      source: 'manual',
    });
    setSaving(false);
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 grid gap-3 rounded-xl border border-[#767F83]/20 p-5 sm:grid-cols-2">
      <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
      <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
      <input placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
      <input placeholder="Service (optional)" value={service} onChange={(e) => setService(e.target.value)} className={fieldClass} />
      <input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className={fieldClass} />
      <textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        className={`${fieldClass} resize-none sm:col-span-2`}
      />
      <div className="flex items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-60"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          {saving ? 'Adding…' : 'Add lead'}
        </button>
        <button type="button" onClick={onCancel} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/campaigns" className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]">
            WhatsApp campaign →
          </Link>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            {showAdd ? 'Close' : '+ Add lead'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mt-6">
          <AddLeadForm
            onAdded={() => {
              setShowAdd(false);
              load();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-1 rounded-full border border-[#767F83]/20 p-1 text-xs">
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

      <div className="mt-6 divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
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
                {lead.source === 'manual' ? ' · added manually' : ''}
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
