import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { GhostButton } from '@/components/GhostButton';
import type { WorkCategory, GalleryItem } from '@/data/workCategories';

interface CategoryGalleryProps {
  category: WorkCategory;
  onClose: () => void;
}

type Filter = 'all' | 'photo' | 'video';

// A category opens into a browsable grid, not a single filmstrip — built to
// hold hundreds of photos and films per category once real client work
// replaces this placeholder set, without ever autoplaying more than one
// clip at a time. Grid tiles are static (poster frames for video, the
// image itself for photos); a click opens the lightbox, which is the only
// place anything actually plays. Every item is stand-in stock media for
// now (⚠️ swap for real client work — see site/README.md).
export function CategoryGallery({ category, onClose }: CategoryGalleryProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? category.items : category.items.filter((it) => it.type === filter)),
    [category.items, filter],
  );

  const videoCount = useMemo(() => category.items.filter((it) => it.type === 'video').length, [category.items]);
  const photoCount = category.items.length - videoCount;

  const activeIndex = activeId ? filtered.findIndex((it) => it.id === activeId) : -1;
  const activeItem = activeIndex >= 0 ? filtered[activeIndex] : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeItem) setActiveId(null);
        else onClose();
      }
      if (!activeItem) return;
      if (e.key === 'ArrowRight') setActiveId(filtered[(activeIndex + 1) % filtered.length]?.id ?? null);
      if (e.key === 'ArrowLeft') setActiveId(filtered[(activeIndex - 1 + filtered.length) % filtered.length]?.id ?? null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeItem, activeIndex, filtered, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#E6DECD]/10 px-5 py-4 sm:px-8">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C6A15B] sm:text-xs">{category.name}</p>
          <p className="mt-1 text-xs text-[#E6DECD]/50">
            {category.items.length} pieces — Reference footage &amp; photography
          </p>
        </div>

        <div className="flex items-center gap-4">
          <FilterTabs filter={filter} onChange={setFilter} videoCount={videoCount} photoCount={photoCount} />
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <p className="mb-5 max-w-md text-sm leading-relaxed text-[#E6DECD]/50">{category.blurb}</p>
        <div className="columns-2 gap-3 [column-fill:_balance] sm:columns-3 sm:gap-4 lg:columns-4">
          {filtered.map((item) => (
            <Tile key={item.id} item={item} onOpen={() => setActiveId(item.id)} />
          ))}
        </div>
      </div>

      {activeItem && (
        <Lightbox
          item={activeItem}
          index={activeIndex}
          total={filtered.length}
          category={category}
          onClose={() => setActiveId(null)}
          onNext={() => setActiveId(filtered[(activeIndex + 1) % filtered.length].id)}
          onPrev={() => setActiveId(filtered[(activeIndex - 1 + filtered.length) % filtered.length].id)}
        />
      )}
    </div>
  );
}

function FilterTabs({
  filter,
  onChange,
  videoCount,
  photoCount,
}: {
  filter: Filter;
  onChange: (f: Filter) => void;
  videoCount: number;
  photoCount: number;
}) {
  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'video', label: `Films (${videoCount})` },
    { key: 'photo', label: `Photos (${photoCount})` },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full border border-[#E6DECD]/15 p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] transition-colors sm:text-xs ${
            filter === t.key ? 'bg-[#C6A15B] text-[#11151A]' : 'text-[#E6DECD]/60 hover:text-[#E6DECD]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Odd tiles run a touch taller — a plain uniform grid of hundreds of same-size
// crops goes flat; this keeps a magazine-ish rhythm without any JS masonry lib.
function tileAspect(index: number): string {
  return index % 5 === 2 ? 'aspect-[3/4]' : index % 7 === 0 ? 'aspect-square' : 'aspect-[4/5]';
}

function Tile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const src = item.type === 'video' ? item.poster : item.src;
  return (
    <button
      onClick={onOpen}
      className="group relative mb-3 block w-full overflow-hidden rounded-xl border border-[#E6DECD]/10 sm:mb-4"
      style={{ breakInside: 'avoid' }}
    >
      <img
        src={src}
        alt={item.type === 'video' ? `${item.id} — reference footage frame` : `${item.id} — reference photo`}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${tileAspect(hashIndex(item.id))}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      {item.type === 'video' && (
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-[#E6DECD] backdrop-blur-sm">
          <Play className="h-3 w-3 fill-current" />
        </span>
      )}
    </button>
  );
}

function hashIndex(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return h;
}

function Lightbox({
  item,
  index,
  total,
  category,
  onClose,
  onNext,
  onPrev,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  category: WorkCategory;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-xs text-[#E6DECD]/50">
          {index + 1} / {total} — {category.name}
        </p>
        <button
          onClick={onClose}
          aria-label="Back to gallery"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {item.type === 'video' ? (
          <video key={item.id} autoPlay loop muted playsInline poster={item.poster} className="h-full w-full object-contain">
            {item.videoWebm && <source src={item.videoWebm} type="video/webm" />}
            <source src={item.videoMp4} type="video/mp4" />
          </video>
        ) : (
          <img key={item.id} src={item.src} alt={`${category.name} — reference photo`} className="h-full w-full object-contain" />
        )}

        {total > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-5 bottom-6 flex flex-wrap items-end justify-between gap-6 sm:inset-x-8">
          <div>
            <h3 className="font-display text-2xl text-[#E6DECD] sm:text-4xl">{category.name}</h3>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-[#E6DECD]/60">{category.blurb}</p>
          </div>
          <span className="pointer-events-auto">
            <GhostButton href="#contact" label="Enquire" />
          </span>
        </div>
      </div>
    </div>
  );
}
