import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Quotation, type QuotationItem } from '@/lib/supabase';
import { CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Deliberately light/white-paper styling, independent of the dark admin
// theme — this is the thing that gets printed or saved as a PDF and sent
// to a client, so it should read like an actual document, not a screenshot
// of a dark UI. window.print() (browser's own "Save as PDF") is the export
// path — no PDF-generation library needed.
export function AdminQuotationPrintPage() {
  const { id } = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation | null | undefined>(undefined);
  const [items, setItems] = useState<QuotationItem[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('quotations').select('*').eq('id', id).single(),
      supabase.from('quotation_items').select('*').eq('quotation_id', id).order('sort_order'),
    ]).then(([{ data: q }, { data: its }]) => {
      setQuotation(q ?? null);
      setItems(its ?? []);
    });
  }, [id]);

  if (quotation === undefined) return <p className="p-10 text-sm text-[#767F83]">Loading…</p>;
  if (quotation === null) return <p className="p-10 text-sm text-[#767F83]">Not found.</p>;

  const docTitle = quotation.include_tax ? 'Tax Invoice / Quotation' : 'Quotation';

  return (
    <div className="min-h-screen bg-[#EFEAE1]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 print:hidden">
        <Link to={`/admin/quotations/${id}`} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#11151A]">
          ← Back to edit
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-white"
          style={{ background: '#11151A' }}
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="mx-auto max-w-3xl bg-white p-10 text-[#1B2027] shadow-sm print:shadow-none sm:p-14">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div>
              <p className="font-display text-lg">7th Creation</p>
              <p className="text-xs text-[#5A6167]">{CONTACT.location}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-display text-xl">{docTitle}</h1>
            <p className="mt-1 text-sm text-[#5A6167]">{quotation.quotation_number}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8A9096]">Billed to</p>
            <p className="mt-1 font-medium">{quotation.client_name}</p>
            {quotation.client_address && <p className="text-[#5A6167]">{quotation.client_address}</p>}
            {quotation.client_email && <p className="text-[#5A6167]">{quotation.client_email}</p>}
            {quotation.client_phone && <p className="text-[#5A6167]">{quotation.client_phone}</p>}
          </div>
          <div className="text-right">
            <p>
              <span className="text-xs uppercase tracking-widest text-[#8A9096]">Issue date </span>
              {formatDate(quotation.issue_date)}
            </p>
            {quotation.valid_until && (
              <p className="mt-1">
                <span className="text-xs uppercase tracking-widest text-[#8A9096]">Valid until </span>
                {formatDate(quotation.valid_until)}
              </p>
            )}
            {quotation.project_title && (
              <p className="mt-1">
                <span className="text-xs uppercase tracking-widest text-[#8A9096]">Project </span>
                {quotation.project_title}
              </p>
            )}
          </div>
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-[#1B2027]/15 text-left text-xs uppercase tracking-widest text-[#8A9096]">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Unit price</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[#1B2027]/10">
                <td className="py-2.5 pr-4">{it.description}</td>
                <td className="py-2.5 text-right">{it.quantity}</td>
                <td className="py-2.5 text-right">{formatINR(it.unit_price)}</td>
                <td className="py-2.5 text-right">{formatINR(it.quantity * it.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-56 text-sm">
            <div className="flex justify-between py-1 text-[#5A6167]">
              <span>Subtotal</span>
              <span>{formatINR(quotation.subtotal)}</span>
            </div>
            {quotation.include_tax && (
              <div className="flex justify-between py-1 text-[#5A6167]">
                <span>
                  {quotation.tax_label} ({quotation.tax_rate}%)
                </span>
                <span>{formatINR(quotation.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#1B2027]/15 py-2 text-base font-medium">
              <span>Total</span>
              <span>{formatINR(quotation.total)}</span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="mt-10 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#8A9096]">Notes</p>
            <p className="mt-1 whitespace-pre-line text-[#5A6167]">{quotation.notes}</p>
          </div>
        )}

        {quotation.terms && (
          <div className="mt-6 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#8A9096]">Terms</p>
            <p className="mt-1 whitespace-pre-line text-[#5A6167]">{quotation.terms}</p>
          </div>
        )}

        <div className="mt-12 border-t border-[#1B2027]/15 pt-4 text-xs text-[#8A9096]">
          <p>
            7th Creation · {CONTACT.email} · {CONTACT.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
