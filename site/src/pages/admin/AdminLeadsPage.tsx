import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Lead, type LeadStatus } from '@/lib/supabase';
import { parseCsv, toCsv, downloadCsv } from '@/lib/csv';

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

interface LeadFormValues {
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  budget_range: string;
  details: string;
}

function LeadForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<LeadFormValues>;
  submitLabel: string;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<LeadFormValues>({
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    service: initial?.service ?? '',
    location: initial?.location ?? '',
    budget_range: initial?.budget_range ?? '',
    details: initial?.details ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof LeadFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(values);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl border border-[#767F83]/20 p-5 sm:grid-cols-2">
      <input required placeholder="Name" value={values.name} onChange={set('name')} className={fieldClass} />
      <input required placeholder="Phone" value={values.phone} onChange={set('phone')} className={fieldClass} />
      <input placeholder="Email (optional)" type="email" value={values.email} onChange={set('email')} className={fieldClass} />
      <input placeholder="Service (optional)" value={values.service} onChange={set('service')} className={fieldClass} />
      <input placeholder="Location (optional)" value={values.location} onChange={set('location')} className={fieldClass} />
      <input
        placeholder="Budget range (optional)"
        value={values.budget_range}
        onChange={set('budget_range')}
        className={fieldClass}
      />
      <textarea
        placeholder="Details (optional)"
        value={values.details}
        onChange={set('details')}
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
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]">
          Cancel
        </button>
      </div>
    </form>
  );
}

function mapCsvRows(rows: string[][]): Array<Pick<Lead, 'name' | 'phone' | 'email' | 'service' | 'location' | 'budget_range' | 'details'>> {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };
  const idx = {
    name: col('name', 'full name', 'client name', 'contact name'),
    phone: col('phone', 'phone number', 'mobile', 'mobile number', 'whatsapp'),
    email: col('email', 'email address'),
    service: col('service', 'service type', 'interested in'),
    location: col('location', 'city'),
    budget_range: col('budget', 'budget range', 'budget_range'),
    details: col('details', 'notes', 'requirement', 'requirements', 'message'),
  };
  const at = (r: string[], i: number) => (i >= 0 ? r[i]?.trim() : '');

  return rows
    .slice(1)
    .map((r) => ({
      name: at(r, idx.name),
      phone: at(r, idx.phone),
      email: at(r, idx.email) || null,
      service: at(r, idx.service) || null,
      location: at(r, idx.location) || null,
      budget_range: at(r, idx.budget_range) || null,
      details: at(r, idx.details) || null,
    }))
    .filter((l) => l.name && l.phone);
}

function ImportLeadsForm({ onImported, onCancel }: { onImported: () => void; onCancel: () => void }) {
  const [rows, setRows] = useState<ReturnType<typeof mapCsvRows>>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    const text = await file.text();
    const parsed = mapCsvRows(parseCsv(text));
    if (parsed.length === 0) {
      setError('No valid rows found — make sure the first row has headers and each contact has at least a name and phone.');
    }
    setRows(parsed);
  };

  const handleImport = async () => {
    setImporting(true);
    const { error: insertError } = await supabase
      .from('leads')
      .insert(rows.map((r) => ({ ...r, source: 'csv-import' })));
    setImporting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    onImported();
  };

  return (
    <div className="mb-6 rounded-xl border border-[#767F83]/20 p-5">
      <p className="text-xs uppercase tracking-widest text-[#767F83]">Import contacts from CSV</p>
      <p className="mt-2 text-xs leading-relaxed text-[#767F83]">
        First row must be column headers. Recognized columns: name, phone, email, service, location, budget_range,
        details (a few common variants of each are matched automatically). Only name and phone are required —
        everything else is optional.
      </p>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        className="mt-4 block text-sm text-[#E6DECD] file:mr-4 file:rounded-full file:border-0 file:bg-[#767F83]/20 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-[#E6DECD]"
      />
      {error && <p className="mt-3 text-sm text-[#B6421D]">{error}</p>}
      {rows.length > 0 && !error && (
        <p className="mt-3 text-sm text-[#7FBF7F]">
          {fileName}: {rows.length} contact{rows.length === 1 ? '' : 's'} ready to import.
        </p>
      )}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleImport}
          disabled={rows.length === 0 || importing}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-50"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          {importing ? 'Importing…' : `Import ${rows.length || ''} contacts`.trim()}
        </button>
        <button type="button" onClick={onCancel} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]">
          Cancel
        </button>
      </div>
    </div>
  );
}

type SortKey = 'name' | 'service' | 'status' | 'created_at';
type SortDir = 'asc' | 'desc';

function SortHeader({
  label,
  sortKey,
  sort,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onClick: (key: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`hover:text-[#E6DECD] ${active ? 'text-[#C6A15B]' : ''}`}
    >
      {label}
      {active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </button>
  );
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'created_at', dir: 'desc' });

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

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const visible = leads?.filter((l) => filter === 'all' || l.status === filter) ?? [];
  const sorted = [...visible].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    const av = (a[sort.key] ?? '') as string;
    const bv = (b[sort.key] ?? '') as string;
    return av < bv ? -dir : av > bv ? dir : 0;
  });

  const exportCsv = () => {
    const csv = toCsv(
      ['name', 'phone', 'email', 'service', 'location', 'budget_range', 'details', 'status', 'source', 'created_at'],
      (leads ?? []).map((l) => [
        l.name,
        l.phone,
        l.email,
        l.service,
        l.location,
        l.budget_range,
        l.details,
        l.status,
        l.source,
        l.created_at,
      ]),
    );
    downloadCsv(`7thcreation-leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-[#E6DECD]">Leads</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/campaigns" className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]">
            WhatsApp campaign →
          </Link>
          <button
            onClick={exportCsv}
            disabled={!leads?.length}
            className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0] disabled:opacity-40"
          >
            Download CSV
          </button>
          <button
            onClick={() => {
              setShowImport((v) => !v);
              setShowAdd(false);
            }}
            className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
          >
            {showImport ? 'Close import' : 'Import CSV'}
          </button>
          <button
            onClick={() => {
              setShowAdd((v) => !v);
              setShowImport(false);
            }}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            {showAdd ? 'Close' : '+ Add lead'}
          </button>
        </div>
      </div>

      {showImport && (
        <div className="mt-6">
          <ImportLeadsForm
            onImported={() => {
              setShowImport(false);
              load();
            }}
            onCancel={() => setShowImport(false)}
          />
        </div>
      )}

      {showAdd && (
        <div className="mt-6">
          <LeadForm
            submitLabel="Add lead"
            onCancel={() => setShowAdd(false)}
            onSubmit={async (values) => {
              await supabase.from('leads').insert({
                name: values.name,
                phone: values.phone,
                email: values.email || null,
                service: values.service || null,
                location: values.location || null,
                budget_range: values.budget_range || null,
                details: values.details || null,
                source: 'manual',
              });
              setShowAdd(false);
              load();
            }}
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

      <div className="mt-5 flex flex-wrap items-center gap-5 px-1 text-xs uppercase tracking-widest text-[#767F83]">
        <span>Sort by:</span>
        <SortHeader label="Name" sortKey="name" sort={sort} onClick={toggleSort} />
        <SortHeader label="Service" sortKey="service" sort={sort} onClick={toggleSort} />
        <SortHeader label="Status" sortKey="status" sort={sort} onClick={toggleSort} />
        <SortHeader label="Date" sortKey="created_at" sort={sort} onClick={toggleSort} />
      </div>

      <div className="mt-3 divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
        {leads === null && <p className="py-6 text-sm text-[#767F83]">Loading…</p>}
        {leads !== null && sorted.length === 0 && <p className="py-6 text-sm text-[#767F83]">No leads here yet.</p>}
        {sorted.map((lead) =>
          editingId === lead.id ? (
            <div key={lead.id} className="py-4">
              <LeadForm
                initial={{
                  name: lead.name,
                  phone: lead.phone,
                  email: lead.email ?? '',
                  service: lead.service ?? '',
                  location: lead.location ?? '',
                  budget_range: lead.budget_range ?? '',
                  details: lead.details ?? '',
                }}
                submitLabel="Save changes"
                onCancel={() => setEditingId(null)}
                onSubmit={async (values) => {
                  await supabase
                    .from('leads')
                    .update({
                      name: values.name,
                      phone: values.phone,
                      email: values.email || null,
                      service: values.service || null,
                      location: values.location || null,
                      budget_range: values.budget_range || null,
                      details: values.details || null,
                    })
                    .eq('id', lead.id);
                  setEditingId(null);
                  load();
                }}
              />
            </div>
          ) : (
            <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="text-sm text-[#E6DECD]">
                  {lead.name} <span className="text-[#767F83]">· {lead.phone}</span>
                </p>
                <p className="mt-0.5 text-xs text-[#767F83]">
                  {lead.service ?? 'No service specified'}
                  {lead.location ? ` · ${lead.location}` : ''}
                  {lead.budget_range ? ` · ${lead.budget_range}` : ''} ·{' '}
                  {new Date(lead.created_at).toLocaleDateString('en-IN')}
                  {lead.source && lead.source !== 'website' ? ` · ${lead.source.replace('-', ' ')}` : ''}
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
                <button
                  onClick={() => {
                    setEditingId(lead.id);
                    setShowAdd(false);
                    setShowImport(false);
                  }}
                  className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
                >
                  Edit
                </button>
                <Link
                  to={`/admin/quotations/new?leadId=${lead.id}`}
                  className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
                >
                  Quote →
                </Link>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
