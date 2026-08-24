import type { CSSProperties } from 'react';

interface RealImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

// A real, licensed Adobe Stock photograph — not fabricated AI imagery, and
// not 7th Creation's own client work either. The small corner tag says so
// plainly but doesn't shout the way the MockPlate icon-tile labels do,
// since these are genuine photographs rather than crude stand-ins. Swap for
// real client work when it exists — see site/README.md.
export function RealImage({ src, alt, className, style }: RealImageProps) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      <span className="absolute bottom-2 right-3 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-[#E6DECD]/50">
        Reference
      </span>
    </div>
  );
}
