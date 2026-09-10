import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { uploadToSiteMedia, captureVideoPoster } from '@/lib/mediaUpload';
import type { MediaItemRow } from '@/lib/siteOverrides';

// Kept as a small local list rather than importing data/workCategories.ts —
// that module runs import.meta.glob over every stock video at build time,
// which this page has no reason to pull in just for six slugs and names.
const WORK_CATEGORY_META = [
  { slug: 'commercial', name: 'Commercial Films' },
  { slug: 'weddings', name: 'Weddings' },
  { slug: 'advertising', name: 'Advertising' },
  { slug: 'events', name: 'Events' },
  { slug: 'musicvideos', name: 'Music Videos' },
  { slug: 'portrait', name: 'Portrait & Fashion' },
];

const uploadLabelClass = 'cursor-pointer text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]';

function SingleImageSlot({
  section,
  title,
  hint,
  current,
  onChange,
}: {
  section: string;
  title: string;
  hint?: string;
  current: MediaItemRow | undefined;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadToSiteMedia(file, section, 'cover');
      if (current) await supabase.from('media_items').delete().eq('id', current.id);
      await supabase.from('media_items').insert({ section, kind: 'image', url, sort_order: 0 });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setBusy(false);
    e.target.value = '';
  };

  const handleRemove = async () => {
    if (!current) return;
    setBusy(true);
    await supabase.from('media_items').delete().eq('id', current.id);
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-lg border border-[#767F83]/15 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#E6DECD]">{title}</p>
          {hint && <p className="text-xs text-[#767F83]">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {current ? (
            <img src={current.url} alt={title} className="h-14 w-20 rounded-md object-cover" />
          ) : (
            <span className="text-xs text-[#767F83]">Using default stock photo</span>
          )}
          <label className={uploadLabelClass}>
            {busy ? 'Uploading…' : current ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" onChange={handleFile} disabled={busy} className="hidden" />
          </label>
          {current && (
            <button onClick={handleRemove} disabled={busy} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#B6421D]">
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-[#B6421D]">{error}</p>}
    </div>
  );
}

function VideoSlot({
  section,
  title,
  hint,
  current,
  onChange,
}: {
  section: string;
  title: string;
  hint?: string;
  current: MediaItemRow | undefined;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const posterBlob = await captureVideoPoster(file);
      const url = await uploadToSiteMedia(file, section, 'video');
      const posterUrl = await uploadToSiteMedia(posterBlob, section, 'poster');
      if (current) await supabase.from('media_items').delete().eq('id', current.id);
      await supabase.from('media_items').insert({ section, kind: 'video', url, poster_url: posterUrl, sort_order: 0 });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setBusy(false);
    e.target.value = '';
  };

  const handleRemove = async () => {
    if (!current) return;
    setBusy(true);
    await supabase.from('media_items').delete().eq('id', current.id);
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-xl border border-[#767F83]/20 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-[#E6DECD]">{title}</h2>
          {hint && <p className="mt-1 text-xs text-[#767F83]">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {current ? (
            <img src={current.poster_url ?? undefined} alt={title} className="h-16 w-28 rounded-md object-cover" />
          ) : (
            <span className="text-xs text-[#767F83]">Using default reference footage</span>
          )}
          <label className={uploadLabelClass}>
            {busy ? 'Uploading…' : current ? 'Replace' : 'Upload'}
            <input type="file" accept="video/*" onChange={handleFile} disabled={busy} className="hidden" />
          </label>
          {current && (
            <button onClick={handleRemove} disabled={busy} className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#B6421D]">
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-[#B6421D]">{error}</p>}
    </div>
  );
}

function MediaListManager({
  section,
  title,
  hint,
  items,
  requireLabel,
  accept,
  onChange,
}: {
  section: string;
  title: string;
  hint?: string;
  items: MediaItemRow[];
  requireLabel: boolean;
  accept: string;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [label, setLabel] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (requireLabel && !label.trim()) {
      setError('Add a short label first, then choose the file.');
      e.target.value = '';
      return;
    }
    setBusy(true);
    setError('');
    try {
      const isVideo = file.type.startsWith('video/');
      const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      if (isVideo) {
        const posterBlob = await captureVideoPoster(file);
        const url = await uploadToSiteMedia(file, section, 'video');
        const posterUrl = await uploadToSiteMedia(posterBlob, section, 'poster');
        await supabase
          .from('media_items')
          .insert({ section, kind: 'video', url, poster_url: posterUrl, label: label || null, sort_order: nextOrder });
      } else {
        const url = await uploadToSiteMedia(file, section, 'image');
        await supabase.from('media_items').insert({ section, kind: 'image', url, label: label || null, sort_order: nextOrder });
      }
      setLabel('');
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setBusy(false);
    e.target.value = '';
  };

  const remove = async (id: string) => {
    await supabase.from('media_items').delete().eq('id', id);
    onChange();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = items[index + dir];
    const current = items[index];
    if (!target) return;
    await supabase.from('media_items').update({ sort_order: target.sort_order }).eq('id', current.id);
    await supabase.from('media_items').update({ sort_order: current.sort_order }).eq('id', target.id);
    onChange();
  };

  return (
    <div className="rounded-lg border border-[#767F83]/15 p-4">
      <p className="text-sm text-[#E6DECD]">{title}</p>
      {hint && <p className="text-xs text-[#767F83]">{hint}</p>}

      {items.length === 0 ? (
        <p className="mt-2 text-xs text-[#767F83]">Not customized yet — showing the default stock set.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-3">
          {items.map((item, i) => (
            <div key={item.id} className="w-24">
              <img
                src={item.kind === 'video' ? (item.poster_url ?? item.url) : item.url}
                alt={item.label ?? ''}
                className="h-20 w-24 rounded-md object-cover"
              />
              {item.label && <p className="mt-1 truncate text-[0.65rem] text-[#767F83]">{item.label}</p>}
              <div className="mt-1 flex items-center justify-between text-[0.65rem] text-[#767F83]">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30 hover:text-[#E6DECD]">
                  ↑
                </button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="disabled:opacity-30 hover:text-[#E6DECD]">
                  ↓
                </button>
                <button onClick={() => remove(item.id)} className="hover:text-[#B6421D]">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {requireLabel && (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Wedding)"
            className="w-40 rounded-lg border border-[#767F83]/30 bg-transparent px-3 py-2 text-xs text-[#E6DECD] placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none"
          />
        )}
        <label className={uploadLabelClass}>
          {busy ? 'Uploading…' : '+ Add'}
          <input type="file" accept={accept} onChange={handleFile} disabled={busy} className="hidden" />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-[#B6421D]">{error}</p>}
    </div>
  );
}

export function AdminSiteMediaPage() {
  const [rows, setRows] = useState<MediaItemRow[] | null>(null);

  const load = () => {
    supabase
      .from('media_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setRows((data ?? []) as MediaItemRow[]));
  };

  useEffect(load, []);

  if (rows === null) return <p className="text-sm text-[#767F83]">Loading…</p>;

  const bySection = (section: string) => rows.filter((r) => r.section === section);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-[#E6DECD]">Site media</h1>
        <Link to="/admin/site" className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]">
          ← Site content
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#767F83]">
        Replace the stock photography and footage with your own, one piece at a time. Uploading a video also grabs a
        thumbnail from it automatically — no separate cover image needed. Anything you don't touch keeps showing the
        built-in placeholder, so there's no rush to do this all at once.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <VideoSlot
          section="hero_bg"
          title="Hero background video"
          hint="The full-screen looping clip behind the homepage headline."
          current={bySection('hero_bg')[0]}
          onChange={load}
        />

        <div className="rounded-xl border border-[#767F83]/20 p-5 sm:p-6">
          <h2 className="font-display text-lg text-[#E6DECD]">Marquee strip</h2>
          <p className="mt-1 text-xs text-[#767F83]">
            The two scrolling rows of tiles above "About". Each row replaces as a whole set — add at least one tile
            to start customizing that row.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <MediaListManager
              section="marquee_row_1"
              title="Row 1"
              items={bySection('marquee_row_1')}
              requireLabel
              accept="image/*"
              onChange={load}
            />
            <MediaListManager
              section="marquee_row_2"
              title="Row 2"
              items={bySection('marquee_row_2')}
              requireLabel
              accept="image/*"
              onChange={load}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#767F83]/20 p-5 sm:p-6">
          <h2 className="font-display text-lg text-[#E6DECD]">Selected work</h2>
          <p className="mt-1 text-xs text-[#767F83]">
            Each category's card cover photo, and the clips/photos shown when a visitor opens its gallery.
          </p>
          <div className="mt-4 flex flex-col gap-6">
            {WORK_CATEGORY_META.map((cat) => (
              <div key={cat.slug}>
                <p className="mb-2 text-sm font-medium text-[#E6DECD]">{cat.name}</p>
                <div className="flex flex-col gap-3">
                  <SingleImageSlot
                    section={`work_${cat.slug}_cover`}
                    title="Card cover photo"
                    current={bySection(`work_${cat.slug}_cover`)[0]}
                    onChange={load}
                  />
                  <MediaListManager
                    section={`work_${cat.slug}_gallery`}
                    title="Gallery (photos & clips)"
                    items={bySection(`work_${cat.slug}_gallery`)}
                    requireLabel={false}
                    accept="image/*,video/*"
                    onChange={load}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
