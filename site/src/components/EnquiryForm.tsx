import { useState, type FormEvent } from 'react';
import { CONTACT } from '@/data/content';
import { FLAGSHIP_SERVICES } from '@/data/content';

const fieldClass =
  'w-full border-0 border-b border-[#767F83]/30 bg-transparent py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none sm:text-base';

// Collects the brief, then hands it straight to WhatsApp as a pre-filled
// message — no backend, no inbox to check, matches how the founder actually
// works leads today.
export function EnquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lines = [
      `Hi 7th Creation, I'm ${name}.`,
      service && `Service: ${service}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      details && `Details: ${details}`,
    ].filter(Boolean);
    const url = `${CONTACT.whatsappHref}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
      <textarea
        placeholder="Tell us about the project"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        className={`${fieldClass} resize-none sm:col-span-2`}
      />
      <button
        type="submit"
        className="mt-1 inline-flex w-fit items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-transform duration-200 hover:-translate-y-0.5 sm:col-span-2 sm:text-sm"
        style={{
          background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)',
          boxShadow: '0px 4px 12px rgba(201, 168, 76, 0.35), inset 0px 2px 6px rgba(255, 255, 255, 0.25)',
        }}
      >
        Send on WhatsApp
      </button>
    </form>
  );
}
