import { useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { GhostButton } from '@/components/GhostButton';

export interface ReelProject {
  n: string;
  name: string;
  category: string;
  videoMp4: string;
  videoWebm: string;
}

interface ProjectReelProps {
  projects: ReelProject[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

// A full-screen, one-at-a-time viewer — walk through every project the way
// you'd walk a reel, not a static lightbox. Each category is stand-in stock
// footage for now (⚠️ swap for real client work — see site/README.md).
export function ProjectReel({ projects, index, onClose, onIndexChange }: ProjectReelProps) {
  const total = projects.length;
  const project = projects[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') onIndexChange((index + 1) % total);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, total, onClose, onIndexChange]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <video
        key={project.n}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      >
        <source src={project.videoWebm} type="video/webm" />
        <source src={project.videoMp4} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.75) 100%)' }}
      />

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10 sm:right-8 sm:top-8"
      >
        <X className="h-5 w-5" />
      </button>

      <span className="absolute left-5 top-5 z-10 text-xs uppercase tracking-[0.3em] text-[#E6DECD]/60 sm:left-8 sm:top-8">
        {index + 1} / {total} — Reference footage
      </span>

      <div className="absolute inset-x-5 bottom-8 z-10 flex flex-wrap items-end justify-between gap-6 sm:inset-x-8 sm:bottom-12">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C6A15B] sm:text-xs">{project.category}</p>
          <h3 className="mt-1 font-display text-3xl text-[#E6DECD] sm:text-5xl">{project.name}</h3>
        </div>
        <GhostButton href="#contact" label="Enquire" />
      </div>

      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-8">
        <button
          onClick={() => onIndexChange((index - 1 + total) % total)}
          aria-label="Previous project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-1.5">
          {projects.map((p, i) => (
            <span
              key={p.n}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? 'bg-[#C6A15B]' : 'bg-[#E6DECD]/30'}`}
            />
          ))}
        </div>
        <button
          onClick={() => onIndexChange((index + 1) % total)}
          aria-label="Next project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DECD]/30 text-[#E6DECD] transition-colors hover:bg-[#E6DECD]/10"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
