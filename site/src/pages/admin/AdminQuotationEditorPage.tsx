import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase, type QuotationStatus } from '@/lib/supabase';

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

interface Row {
  key: string;
  description: string;
  quantity: number;
  unit_price: number;
}

function newRow(): Row {
  return { key: Math.random().toString(36).slice(2), description: '', quantity: 1, unit_price: 0 };
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function AdminQuotationEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');
  const isNew = !id;
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(isNew);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(
    'Prices are valid until the date above. 50% advance to confirm the booking, balance on delivery.',
  );
  const [includeTax, setIncludeTax] = useState(false);
  const [taxLabel, setTaxLabel] = useState('GST');
  const [taxRate, setTaxRate] = useState(18);
  const [status, setStatus] = useState<QuotationStatus>('draft');
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [quotationNumber, setQuotationNumber] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew) {
      Promise.all([
        supabase.from('quotations').select('*').eq('id', id).single(),
        supabase.from('quotation_items').select('*').eq('quotation_id', id).order('sort_order'),
      ]).then(([{ data: q }, { data: items }]) => {
        if (!q) return;
        setClientName(q.client_name);
        setClientEmail(q.client_email ?? '');
        setClientPhone(q.client_phone ?? '');
        setClientAddress(q.client_address ?? '');
        setProjectTitle(q.project_title);
        setIssueDate(q.issue_date);
        setValidUntil(q.valid_until ?? '');
        setNotes(q.notes);
        setTerms(q.terms);
        setIncludeTax(q.include_tax);
        setTaxLabel(q.tax_label);
        setTaxRate(q.tax_rate);
        setStatus(q.status);
        setQuotationNumber(q.quotation_number);
        if (items && items.length > 0) {
          setRows(
            items.map((it) => ({
              key: it.id,
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price,
            })),
          );
        }
        setLoaded(true);
      });
    } else if (leadId) {
      supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()
        .then(({ data: lead }) => {
          if (!lead) return;
          setClientName(lead.name);
          setClientEmail(lead.email ?? '');
          setClientPhone(lead.phone);
          setProjectTitle(lead.service ?? '');
          if (lead.details) setNotes(lead.details);
        });
    }
  }, [id, isNew, leadId]);

  const subtotal = rows.reduce((sum, r) => sum + r.quantity * r.unit_price, 0);
  const taxAmount = includeTax ? (subtotal * taxRate) / 100 : 0;
  const total = subtotal + taxAmount;

  const updateRow = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const removeRow = (key: string) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs));

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      lead_id: leadId || undefined,
      client_name: clientName,
      client_email: clientEmail || null,
      client_phone: clientPhone || null,
      client_address: clientAddress || null,
      project_title: projectTitle,
      issue_date: issueDate,
      valid_until: validUntil || null,
      notes,
      terms,
      include_tax: includeTax,
      tax_label: taxLabel,
      tax_rate: taxRate,
      subtotal,
      tax_amount: taxAmount,
      total,
      status,
    };

    let quotationId = id;

    if (isNew) {
      const { data, error: insertError } = await supabase.from('quotations').insert(payload).select('id').single();
      if (insertError || !data) {
        setError(insertError?.message ?? 'Could not create quotation.');
        setSaving(false);
        return;
      }
      quotationId = data.id;
    } else {
      const { error: updateError } = await supabase.from('quotations').update(payload).eq('id', id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      await supabase.from('quotation_items').delete().eq('quotation_id', id);
    }

    const itemRows = rows
      .filter((r) => r.description.trim())
      .map((r, i) => ({
        quotation_id: quotationId,
        description: r.description,
        quantity: r.quantity,
        unit_price: r.unit_price,
        sort_order: i,
      }));
    if (itemRows.length > 0) {
      await supabase.from('quotation_items').insert(itemRows);
    }

    setSaving(false);
    navigate(`/admin/quotations/${quotationId}`);
  };

  if (!loaded) return <p className="text-sm text-[#767F83]">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-[#E6DECD]">
          {isNew ? 'New quotation' : `Edit ${quotationNumber}`}
        </h1>
        {!isNew && (
          <Link
            to={`/admin/quotations/${id}/print`}
            target="_blank"
            className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
          >
            Preview / Print →
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-8">
        <section>
          <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Client</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} className={fieldClass} />
            <input placeholder="Email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className={fieldClass} />
            <input placeholder="Phone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={fieldClass} />
            <input placeholder="Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className={fieldClass} />
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Project</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              placeholder="Project / shoot title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className={`${fieldClass} sm:col-span-3`}
            />
            <label className="flex flex-col gap-1 text-xs text-[#767F83]">
              Issue date
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-[#767F83]">
              Valid until
              <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-[#767F83]">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value as QuotationStatus)} className={fieldClass}>
                {(['draft', 'sent', 'accepted', 'rejected'] as const).map((s) => (
                  <option key={s} value={s} className="bg-ink">
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Line items</p>
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <div key={row.key} className="grid grid-cols-[1fr_5rem_7rem_7rem_auto] items-center gap-2">
                <input
                  placeholder="Description"
                  value={row.description}
                  onChange={(e) => updateRow(row.key, { description: e.target.value })}
                  className={fieldClass}
                />
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.key, { quantity: Number(e.target.value) })}
                  className={fieldClass}
                />
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Unit price"
                  value={row.unit_price}
                  onChange={(e) => updateRow(row.key, { unit_price: Number(e.target.value) })}
                  className={fieldClass}
                />
                <p className="text-right text-sm text-[#E6DECD]">{formatINR(row.quantity * row.unit_price)}</p>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  aria-label="Remove row"
                  className="text-[#767F83] hover:text-[#B6421D]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, newRow()])}
            className="mt-3 text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
          >
            + Add line
          </button>
        </section>

        <section className="flex flex-col gap-3 sm:max-w-xs sm:self-end">
          <label className="flex items-center gap-2 text-sm text-[#E6DECD]">
            <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} />
            Include tax invoice
          </label>
          {includeTax && (
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Tax label" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} className={fieldClass} />
              <input
                type="number"
                min={0}
                step="any"
                placeholder="Rate %"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          )}
          <div className="mt-2 flex flex-col gap-1 border-t border-[#767F83]/15 pt-3 text-sm">
            <div className="flex justify-between text-[#767F83]">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {includeTax && (
              <div className="flex justify-between text-[#767F83]">
                <span>{taxLabel} ({taxRate}%)</span>
                <span>{formatINR(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base text-[#E6DECD]">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs uppercase tracking-widest text-[#767F83]">Notes &amp; terms</p>
          <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${fieldClass} resize-none`} />
          <textarea
            placeholder="Terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={2}
            className={`${fieldClass} mt-3 resize-none`}
          />
        </section>

        {error && <p className="text-xs text-[#B6421D]">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !clientName}
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-60"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            {saving ? 'Saving…' : 'Save quotation'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/quotations')}
            className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
