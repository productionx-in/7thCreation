import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { uploadToSiteMedia, captureVideoPoster } from '@/lib/mediaUpload';
import { extractYouTubeId, youtubeThumbnailUrl } from '@/lib/youtube';
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
const textInputClass =
  'rounded-lg border border-[#767F83]/30 bg-transparent px-3 py-2 text-xs text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

// Every action on this page saves immediately (there's no separate "Save"
// step, unlike the text-content editor) — this flash is the only signal
// that a click actually went through and is live, so every write path
// fires it.
function useFlash() {
  const [flashed, setFlashed] = useState(false);
  const flash = () => {
    setFlashed(true);
    setTimeout(() => setFlashed(false), 2500);
  };
  return [flashed, flash] as const;
}

function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="text-xs uppercase tracking-widest text-[#7FBF7F]">Saved — live now</span>;
}

function ModeTabs({ mode, onChange }: { mode: 'upload' | 'youtube'; onChange: (m: 'upload' | 'youtube') => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-[#767F83]/20 p-0.5 text-[0.65rem]">
      {(['upload', 'youtube'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wider transition-colors ${
            mode === m ? 'bg-[#C6A15B] text-[#11151A]' : 'text-[#767F83] hover:text-[#E6DECD]'
          }`}
        >
          {m === 'upload' ? 'Upload file' : 'YouTube link'}
        </button>
      ))}
    </div>
  );
}

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
  const [saved, flash] = useFlash();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadToSiteMedia(file, section, 'cover');
      if (current) {
        const { error: delErr } = await supabase.from('media_items').delete().eq('id', current.id);
        if (delErr) throw delErr;
      }
      const { error: insErr } = await supabase.from('media_items').insert({ section, kind: 'image', url, sort_order: 0 });
      if (insErr) throw insErr;
      flash();
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
    setError('');
    const { error: delErr } = await supabase.from('media_items').delete().eq('id', current.id);
    setBusy(false);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    flash();
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
      <div className="mt-2 flex items-center gap-3">
        <SavedBadge show={saved} />
        {error && <p className="text-xs text-[#B6421D]">{error}</p>}
      </div>
    </div>
  );
}

// Upload-only, deliberately — no YouTube option here. A YouTube embed
// always shows a bit of its own UI (the title/channel card at the start is
// the clearest example), which is fine for a gallery clip someone chose to
// open, but wrong for a background loop that's supposed to read as plain
// footage. Gallery items keep the YouTube option; this one slot doesn't.
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
  const [saved, flash] = useFlash();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const posterBlob = await captureVideoPoster(file);
      const url = await uploadToSiteMedia(file, section, 'video');
      const posterUrl = await uploadToSiteMedia(posterBlob, section, 'poster');
      if (current) {
        const { error: delErr } = await supabase.from('media_items').delete().eq('id', current.id);
        if (delErr) throw delErr;
      }
      const { error: insErr } = await supabase
        .from('media_items')
        .insert({ section, kind: 'video', url, poster_url: posterUrl, sort_order: 0 });
      if (insErr) throw insErr;
      flash();
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
    setError('');
    const { error: delErr } = await supabase.from('media_items').delete().eq('id', current.id);
    setBusy(false);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    flash();
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
      <div className="mt-2 flex items-center gap-3">
        <SavedBadge show={saved} />
        {error && <p className="text-xs text-[#B6421D]">{error}</p>}
      </div>
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
  allowYoutube = false,
  onChange,
}: {
  section: string;
  title: string;
  hint?: string;
  items: MediaItemRow[];
  requireLabel: boolean;
  accept: string;
  allowYoutube?: boolean;
  onChange: () => void;
}) {
  const [mode, setMode] = useState<'upload' | 'youtube'>('upload');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [label, setLabel] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [customThumb, setCustomThumb] = useState<File | null>(null);
  const [saved, flash] = useFlash();

  const nextOrder = () => (items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0);
  const youtubeLines = youtubeInput
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

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
      if (isVideo) {
        const posterBlob = await captureVideoPoster(file);
        const url = await uploadToSiteMedia(file, section, 'video');
        const posterUrl = await uploadToSiteMedia(posterBlob, section, 'poster');
        const { error: insErr } = await supabase
          .from('media_items')
          .insert({ section, kind: 'video', url, poster_url: posterUrl, label: label || null, sort_order: nextOrder() });
        if (insErr) throw insErr;
      } else {
        const url = await uploadToSiteMedia(file, section, 'image');
        const { error: insErr } = await supabase
          .from('media_items')
          .insert({ section, kind: 'image', url, label: label || null, sort_order: nextOrder() });
        if (insErr) throw insErr;
      }
      setLabel('');
      flash();
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
    setBusy(false);
    e.target.value = '';
  };

  // One link per line, so several clips can be added in a single action
  // instead of one add-click-wait cycle per video.
  const handleAddYoutube = async () => {
    if (youtubeLines.length === 0) {
      setError('Paste at least one YouTube link.');
      return;
    }
    const ids: string[] = [];
    for (const line of youtubeLines) {
      const id = extractYouTubeId(line);
      if (!id) {
        setError(`This doesn't look like a valid YouTube link: "${line}"`);
        return;
      }
      ids.push(id);
    }
    setBusy(true);
    setError('');
    try {
      // A custom thumbnail only makes sense when adding exactly one video —
      // for a batch, every video gets its own auto-fetched YouTube thumbnail.
      const customPosterUrl = ids.length === 1 && customThumb ? await uploadToSiteMedia(customThumb, section, 'thumb') : null;
      const base = nextOrder();
      const rows = ids.map((id, i) => ({
        section,
        kind: 'video' as const,
        source: 'youtube' as const,
        url: id,
        poster_url: customPosterUrl ?? youtubeThumbnailUrl(id),
        label: ids.length === 1 ? label || null : null,
        sort_order: base + i,
      }));
      const { error: insErr } = await supabase.from('media_items').insert(rows);
      if (insErr) throw insErr;
      setLabel('');
      setYoutubeInput('');
      setCustomThumb(null);
      flash();
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add these videos');
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    setError('');
    const { error: delErr } = await supabase.from('media_items').delete().eq('id', id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    flash();
    onChange();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = items[index + dir];
    const current = items[index];
    if (!target) return;
    setError('');
    const { error: e1 } = await supabase.from('media_items').update({ sort_order: target.sort_order }).eq('id', current.id);
    const { error: e2 } = await supabase.from('media_items').update({ sort_order: current.sort_order }).eq('id', target.id);
    if (e1 || e2) {
      setError((e1 ?? e2)!.message);
      return;
    }
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
              {item.source === 'youtube' && (
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-widest text-[#767F83]">YouTube</p>
              )}
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

      <div className="mt-4 flex flex-col gap-3">
        {allowYoutube && <ModeTabs mode={mode} onChange={setMode} />}
        <div className="flex flex-wrap items-center gap-3">
          {requireLabel && (
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g. Wedding)"
              className={`${textInputClass} w-40`}
            />
          )}
          {mode === 'upload' || !allowYoutube ? (
            <label className={uploadLabelClass}>
              {busy ? 'Uploading…' : '+ Add'}
              <input type="file" accept={accept} onChange={handleFile} disabled={busy} className="hidden" />
            </label>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <textarea
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder={'https://youtube.com/watch?v=…\nhttps://youtube.com/watch?v=… (one link per line — add several at once)'}
                rows={2}
                className={`${textInputClass} w-full resize-y`}
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-[0.65rem] uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]">
                  {customThumb ? 'Thumbnail chosen' : 'Custom thumbnail (optional, single video only)'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCustomThumb(e.target.files?.[0] ?? null)}
                    disabled={youtubeLines.length > 1}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleAddYoutube}
                  disabled={busy || youtubeLines.length === 0}
                  className={`${uploadLabelClass} disabled:opacity-40`}
                >
                  {busy
                    ? 'Saving…'
                    : youtubeLines.length > 1
                      ? `+ Add ${youtubeLines.length} videos`
                      : '+ Add'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <SavedBadge show={saved} />
        {error && <p className="text-xs text-[#B6421D]">{error}</p>}
      </div>
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
        Replace the stock photography and footage with your own, one piece at a time. Uploading a video file grabs a
        thumbnail automatically — no separate cover image needed. For clips already on YouTube, use "YouTube link"
        instead of uploading the file itself — it saves server space and only needs the URL (plus an optional custom
        thumbnail, otherwise YouTube's own is used). Anything you don't touch keeps showing the built-in placeholder,
        so there's no rush to do this all at once.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <VideoSlot
          section="hero_bg"
          title="Hero background video"
          hint="The full-screen looping clip behind the homepage headline. Upload only — YouTube isn't offered here since its embed always shows a bit of its own UI (the title card at the start, for one), which reads wrong on a background loop. For a linked YouTube video, use a work category's gallery instead."
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
                    allowYoutube
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
