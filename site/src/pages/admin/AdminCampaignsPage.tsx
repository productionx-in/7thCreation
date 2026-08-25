import { useEffect, useMemo, useState } from 'react';
import { supabase, type Lead } from '@/lib/supabase';

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

function personalize(template: string, lead: Lead): string {
  const firstName = lead.name.split(' ')[0];
  return template.split('{{name}}').join(firstName);
}

function toWhatsAppHref(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function AdminCampaignsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('Hi {{name}}, this is 7th Creation — following up on your enquiry. ');
  const [running, setRunning] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setLeads(data ?? []));
  }, []);

  const queue = useMemo(() => leads?.filter((l) => selected.has(l.id)) ?? [], [leads, selected]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => setSelected(new Set((leads ?? []).map((l) => l.id)));
  const selectNone = () => setSelected(new Set());

  const start = () => {
    setCursor(0);
    setSentIds(new Set());
    setRunning(true);
  };

  const current = queue[cursor];

  const markSentAndNext = () => {
    if (current) setSentIds((s) => new Set(s).add(current.id));
    if (cursor + 1 >= queue.length) {
      setRunning(false);
    } else {
      setCursor((c) => c + 1);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-[#E6DECD]">WhatsApp campaign</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#767F83]">
        This opens a pre-filled WhatsApp chat for each contact you select, one at a time, for you to review and hit
        send — it does not send messages automatically. True automated bulk sending needs Meta's WhatsApp Business
        Platform with pre-approved message templates (a separate business/developer setup); ask if you want that
        built once you have a WhatsApp Business API account.
      </p>

      {!running ? (
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-[#767F83]">
              Message (use <code>{'{{name}}'}</code> to personalize)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#767F83]">
                Select recipients ({selected.size} selected)
              </p>
              <div className="flex gap-3 text-xs uppercase tracking-widest text-[#C6A15B]">
                <button onClick={selectAll} className="hover:text-[#E4CFA0]">Select all</button>
                <button onClick={selectNone} className="hover:text-[#E4CFA0]">Clear</button>
              </div>
            </div>
            <div className="max-h-96 divide-y divide-[#767F83]/15 overflow-y-auto rounded-xl border border-[#767F83]/20">
              {leads === null && <p className="p-4 text-sm text-[#767F83]">Loading…</p>}
              {leads?.length === 0 && <p className="p-4 text-sm text-[#767F83]">No leads yet.</p>}
              {leads?.map((lead) => (
                <label key={lead.id} className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#E6DECD]/[0.03]">
                  <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggle(lead.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#E6DECD]">
                      {lead.name} <span className="text-[#767F83]">· {lead.phone}</span>
                    </p>
                    <p className="text-xs text-[#767F83]">{lead.service ?? 'No service specified'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={start}
            disabled={selected.size === 0 || !message.trim()}
            className="inline-flex w-fit items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-50"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            Start campaign ({selected.size})
          </button>
        </div>
      ) : (
        <div className="mt-8 max-w-md">
          <p className="text-xs uppercase tracking-widest text-[#767F83]">
            {cursor + 1} of {queue.length} — {sentIds.size} sent
          </p>
          {current && (
            <div className="mt-4 rounded-xl border border-[#767F83]/20 p-6">
              <p className="text-lg text-[#E6DECD]">{current.name}</p>
              <p className="text-sm text-[#767F83]">{current.phone}</p>
              <p className="mt-4 whitespace-pre-line rounded-lg bg-[#0D1015] p-4 text-sm text-[#E6DECD]">
                {personalize(message, current)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href={toWhatsAppHref(current.phone, personalize(message, current))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
                  style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
                >
                  Open WhatsApp →
                </a>
                <button onClick={markSentAndNext} className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]">
                  Mark sent &amp; next
                </button>
                <button onClick={() => setRunning(false)} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]">
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
