import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GhostButton } from '@/components/GhostButton';
import type { WorkCategory } from '@/data/workCategories';

interface CategoryGalleryProps {
  category: WorkCategory;
  onClose: () => void;
}

// A full-screen viewer for one category: a large playing preview up top, and
// a scrollable filmstrip carousel of every clip in that category below —
// click or scroll the strip to jump the preview. Every clip is stand-in
// stock footage for now (⚠️ swap for real client work — see site/README.md).
export function CategoryGallery({ category, onClose }: CategoryGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = category.items.length;
  const item = category.items[index];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, total]);

  useEffect(() => {
    const track = trackRef.current;
    const active = track?.children[index] as HTMLElement | undefined;
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C6A15B] sm:text-xs">{category.name}</p>
          <p className="mt-1 text-xs text-[#E6DECD]/50">
            {index + 1} / {total} — Reference footage
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <video key={item.id} autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src={item.videoWebm} type="video/webm" />
          <source src={item.videoMp4} type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.7) 100%)' }}
        />

        {index > 0 && (
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            aria-label="Previous"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {index < total - 1 && (
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, total - 1))}
            aria-label="Next"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
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

      <div className="flex-shrink-0 border-t border-[#E6DECD]/10 bg-black px-5 py-4 sm:px-8">
        <div ref={trackRef} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollSnapType: 'x proximity' }}>
          {category.items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setIndex(i)}
              style={{ scrollSnapAlign: 'center' }}
              className={`relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-36 ${
                i === index ? 'border-[#C6A15B]' : 'border-[#E6DECD]/15 hover:border-[#E6DECD]/40'
              }`}
            >
              <video autoPlay loop muted playsInline preload="auto" className="h-full w-full object-cover">
                <source src={it.videoWebm} type="video/webm" />
                <source src={it.videoMp4} type="video/mp4" />
              </video>
              {i !== index && <div className="absolute inset-0 bg-black/35" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
