import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { HERO, ABOUT_COPY, FLAGSHIP_SERVICES, PROCESS, CONTACT } from '@/data/content';

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

type Hero = typeof HERO;
type Services = typeof FLAGSHIP_SERVICES;
type ProcessSteps = typeof PROCESS;
type Contact = typeof CONTACT;

function useSectionRow<T>(key: string, fallback: T): [T, boolean, () => void] {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  const reload = () => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setValue({ ...fallback, ...(data.value as object) } as T);
        setLoaded(true);
      });
  };
  useEffect(reload, []);
  return [value, loaded, reload];
}

async function saveSection(key: string, value: unknown) {
  await supabase.from('site_content').upsert({ key, value });
}

function SectionShell({
  title,
  hint,
  children,
  onSave,
  saving,
  saved,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#767F83]/20 p-5 sm:p-6">
      <h2 className="font-display text-lg text-[#E6DECD]">{title}</h2>
      {hint && <p className="mt-1 text-xs text-[#767F83]">{hint}</p>}
      <div className="mt-5 flex flex-col gap-3">{children}</div>
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-60"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          {saving ? 'Saving…' : 'Save section'}
        </button>
        {saved && <span className="text-xs uppercase tracking-widest text-[#7FBF7F]">Saved — live now</span>}
      </div>
    </div>
  );
}

function useSaveState() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const run = async (fn: () => Promise<void>) => {
    setSaving(true);
    setSaved(false);
    await fn();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return { saving, saved, run };
}

function HeroEditor() {
  const [hero, loaded] = useSectionRow<Hero>('hero', HERO);
  const [draft, setDraft] = useState<Hero>(HERO);
  const { saving, saved, run } = useSaveState();

  useEffect(() => {
    if (loaded) setDraft(hero);
  }, [loaded]);

  const set = (k: keyof Hero) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  return (
    <SectionShell
      title="Hero"
      hint="The first thing every visitor sees — the big headline and subtext over the background video."
      saving={saving}
      saved={saved}
      onSave={() => run(() => saveSection('hero', draft))}
    >
      <input value={draft.eyebrow} onChange={set('eyebrow')} placeholder="Eyebrow line" className={fieldClass} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={draft.headingLine1} onChange={set('headingLine1')} placeholder="Heading line 1" className={fieldClass} />
        <input value={draft.headingLine2} onChange={set('headingLine2')} placeholder="Heading line 2 (italic)" className={fieldClass} />
      </div>
      <textarea value={draft.sub} onChange={set('sub')} rows={2} placeholder="Subtext" className={`${fieldClass} resize-none`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={draft.ctaPrimary} onChange={set('ctaPrimary')} placeholder="Primary button label" className={fieldClass} />
        <input value={draft.ctaSecondary} onChange={set('ctaSecondary')} placeholder="Secondary button label" className={fieldClass} />
      </div>
    </SectionShell>
  );
}

function AboutEditor() {
  const [about, loaded] = useSectionRow<{ copy: string }>('about', { copy: ABOUT_COPY });
  const [draft, setDraft] = useState(ABOUT_COPY);
  const { saving, saved, run } = useSaveState();

  useEffect(() => {
    if (loaded) setDraft(about.copy);
  }, [loaded]);

  return (
    <SectionShell
      title="About"
      hint="The paragraph in the About section, below the corner icons."
      saving={saving}
      saved={saved}
      onSave={() => run(() => saveSection('about', { copy: draft }))}
    >
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} className={`${fieldClass} resize-none`} />
    </SectionShell>
  );
}

function ServicesEditor() {
  const [services, loaded] = useSectionRow<Services>('services', FLAGSHIP_SERVICES);
  const [draft, setDraft] = useState<Services>(FLAGSHIP_SERVICES);
  const { saving, saved, run } = useSaveState();

  useEffect(() => {
    if (loaded) setDraft(services);
  }, [loaded]);

  const setField = (i: number, key: 'name' | 'copy') => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => d.map((s, idx) => (idx === i ? { ...s, [key]: e.target.value } : s)) as Services);

  return (
    <SectionShell
      title="Services"
      hint="The six numbered services. Order and count are fixed — only name and description are editable."
      saving={saving}
      saved={saved}
      onSave={() => run(() => saveSection('services', draft))}
    >
      {draft.map((s, i) => (
        <div key={s.n} className="rounded-lg border border-[#767F83]/15 p-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm text-[#C6A15B]/60">{s.n}</span>
            <input value={s.name} onChange={setField(i, 'name')} className={fieldClass} />
          </div>
          <textarea value={s.copy} onChange={setField(i, 'copy')} rows={2} className={`${fieldClass} mt-2 resize-none`} />
        </div>
      ))}
    </SectionShell>
  );
}

function ProcessEditor() {
  const [process, loaded] = useSectionRow<ProcessSteps>('process', PROCESS);
  const [draft, setDraft] = useState<ProcessSteps>(PROCESS);
  const { saving, saved, run } = useSaveState();

  useEffect(() => {
    if (loaded) setDraft(process);
  }, [loaded]);

  const setField = (i: number, key: 'title' | 'copy') => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((d) => d.map((s, idx) => (idx === i ? { ...s, [key]: e.target.value } : s)) as ProcessSteps);

  return (
    <SectionShell
      title="Process"
      hint="The four expandable steps in the 'How it runs' section."
      saving={saving}
      saved={saved}
      onSave={() => run(() => saveSection('process', draft))}
    >
      {draft.map((s, i) => (
        <div key={s.step} className="rounded-lg border border-[#767F83]/15 p-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm text-[#B6421D]">{s.step}</span>
            <input value={s.title} onChange={setField(i, 'title')} className={fieldClass} />
          </div>
          <textarea value={s.copy} onChange={setField(i, 'copy')} rows={2} className={`${fieldClass} mt-2 resize-none`} />
        </div>
      ))}
    </SectionShell>
  );
}

function ContactEditor() {
  const [contact, loaded] = useSectionRow<Contact>('contact', CONTACT);
  const [draft, setDraft] = useState<Contact>(CONTACT);
  const { saving, saved, run } = useSaveState();

  useEffect(() => {
    if (loaded) setDraft(contact);
  }, [loaded]);

  const set = (k: keyof Contact) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDraft((d) => {
      const next = { ...d, [k]: val };
      // Keep the tel:/wa.me links in sync when the plain phone number changes,
      // so the founder only has to edit one field for the common case.
      if (k === 'phone') {
        const digits = val.replace(/\D/g, '');
        if (digits) {
          next.phoneHref = `tel:+${digits}`;
          next.whatsappHref = `https://wa.me/${digits}`;
        }
      }
      return next;
    });
  };

  return (
    <SectionShell
      title="Contact & socials"
      hint="Shown in the footer, contact section, and hero header. Changing the phone number also updates the WhatsApp and call links."
      saving={saving}
      saved={saved}
      onSave={() => run(() => saveSection('contact', draft))}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={draft.email} onChange={set('email')} placeholder="Email" className={fieldClass} />
        <input value={draft.phone} onChange={set('phone')} placeholder="Phone (e.g. +91 90321 80743)" className={fieldClass} />
      </div>
      <input value={draft.location} onChange={set('location')} placeholder="Location" className={fieldClass} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={draft.instagram} onChange={set('instagram')} placeholder="Instagram URL" className={fieldClass} />
        <input value={draft.youtube} onChange={set('youtube')} placeholder="YouTube URL" className={fieldClass} />
      </div>
    </SectionShell>
  );
}

export function AdminSiteContentPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-[#E6DECD]">Site content</h1>
        <Link to="/admin/site/media" className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]">
          Site media →
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#767F83]">
        Edit the text on the live site directly — no code, no deploy. Changes appear on the site within moments of
        saving. Photos and videos are managed separately, under "Site media".
      </p>
      <div className="mt-8 flex flex-col gap-6">
        <HeroEditor />
        <AboutEditor />
        <ServicesEditor />
        <ProcessEditor />
        <ContactEditor />
      </div>
    </div>
  );
}
