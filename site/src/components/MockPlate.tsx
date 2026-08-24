import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

interface MockPlateProps {
  label: string;
  icon: LucideIcon;
  className?: string;
  style?: CSSProperties;
}

// ⚠️ MOCK FOOTAGE — a locally-rendered placeholder, not a photo. This
// environment's network policy blocks arbitrary external image hosts (tested:
// picsum.photos and the Lovable preview domain both hard-reject at the proxy
// with 403 on CONNECT), and hotlinking someone else's preview URL is fragile
// regardless of policy. Every real photo/frame in this site should replace
// one of these plates with a local asset — see site/README.md.
export function MockPlate({ label, icon: Icon, className, style }: MockPlateProps) {
  return (
    <div
      className={`grain-overlay relative flex items-center justify-center overflow-hidden ${className ?? ''}`}
      style={{ background: 'linear-gradient(155deg, #1A1F26 0%, #11151A 55%, #11151A 100%)', ...style }}
    >
      {/* Corner brackets — a viewfinder motif, legible as "placeholder" rather than accidental content */}
      {[
        'left-3 top-3 border-l-2 border-t-2',
        'right-3 top-3 border-r-2 border-t-2',
        'left-3 bottom-3 border-l-2 border-b-2',
        'right-3 bottom-3 border-r-2 border-b-2',
      ].map((pos) => (
        <span key={pos} className={`absolute h-4 w-4 border-[#C6A15B]/30 ${pos}`} />
      ))}

      <Icon className="h-[22%] w-[22%] text-[#C6A15B]/25" strokeWidth={1} />

      <span className="absolute bottom-3 left-4 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-[#C6A15B]/50 sm:text-[0.65rem]">
        Mock · {label}
      </span>
    </div>
  );
}
