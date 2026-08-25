import { useState, type FormEvent } from 'react';
import { CONTACT, FLAGSHIP_SERVICES } from '@/data/content';

const fieldClass =
  'w-full border-0 border-b border-[#767F83]/30 bg-transparent py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none sm:text-base';

const BUDGET_RANGES = ['Under ₹50,000', '₹50,000 – ₹1,50,000', '₹1,50,000 – ₹5,00,000', '₹5,00,000+', 'Not sure yet'];

// Saves the enquiry as a lead in the CRM (so nothing gets lost in a chat
// thread), then still opens WhatsApp with the same details pre-filled —
// that's how the founder actually works leads day to day, this just also
// gives them a record of every one that comes in.
export function EnquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Dynamically imported so supabase-js (and its own dependency chain)
    // never loads for a visitor who just looks at the page — only once
    // they actually submit this form.
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('leads').insert({
      name,
      email: email || null,
      phone,
      service: service || null,
      event_date: eventDate || null,
      location: location || null,
      budget_range: budgetRange || null,
      details: details || null,
    });

    const lines = [
      `Hi 7th Creation, I'm ${name}.`,
      service && `Service: ${service}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      eventDate && `Date: ${eventDate}`,
      location && `Location: ${location}`,
      budgetRange && `Budget: ${budgetRange}`,
      details && `Details: ${details}`,
    ].filter(Boolean);
    const url = `${CONTACT.whatsappHref}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid max-w-xl gap-5 sm:grid-cols-2">
      <input
        required
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={fieldClass}
      />
      <select
        required
        value={service}
        onChange={(e) => setService(e.target.value)}
        className={`${fieldClass} ${service ? '' : 'text-[#767F83]'}`}
      >
        <option value="" disabled>
          What are you looking for?
        </option>
        {FLAGSHIP_SERVICES.map((s) => (
          <option key={s.n} value={s.name} className="bg-ink text-[#E6DECD]">
            {s.name}
          </option>
        ))}
        <option value="Something else" className="bg-ink text-[#E6DECD]">
          Something else
        </option>
      </select>
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={fieldClass}
      />
      <input
        required
        type="tel"
        placeholder="Phone / WhatsApp number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={fieldClass}
      />
      <label className="flex flex-col gap-1 text-xs text-[#767F83]">
        Event / shoot date (if known)
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className={fieldClass}
        />
      </label>
      <input
        type="text"
        placeholder="Location / city"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={fieldClass}
      />
      <select
        value={budgetRange}
        onChange={(e) => setBudgetRange(e.target.value)}
        className={`${fieldClass} sm:col-span-2 ${budgetRange ? '' : 'text-[#767F83]'}`}
      >
        <option value="">Budget range (optional)</option>
        {BUDGET_RANGES.map((b) => (
          <option key={b} value={b} className="bg-ink text-[#E6DECD]">
            {b}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Tell us about the project"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        className={`${fieldClass} resize-none sm:col-span-2`}
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex w-fit items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2 sm:text-sm"
        style={{
          background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)',
          boxShadow: '0px 4px 12px rgba(201, 168, 76, 0.35), inset 0px 2px 6px rgba(255, 255, 255, 0.25)',
        }}
      >
        {submitting ? 'Sending…' : 'Send on WhatsApp'}
      </button>
    </form>
  );
}
