interface LogoProps {
  className?: string;
  variant?: 'mark' | 'full';
}

// A unified 7→crescent monogram, drawn as one continuous vector gesture —
// not two glyphs placed together. This is a placeholder redraw, not the
// commissioned mark: brand/identity-brief.md scopes the real professional
// pass. But it is built to the brief's one non-negotiable constraint (§6.02:
// "the 7 and C must always feel like one unified symbol") in a way the old
// literal "7C" text-in-a-circle did not.
//
// Construction: the 7's diagonal stroke sweeps continuously into the outer
// edge of a crescent. Inside the crescent: a small peak, a standing figure,
// and a single star — the brief's vision/journey/possibility symbolism,
// abstracted to the scale a monogram actually reads at.
export function Logo({ className, variant = 'mark' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="7th Creation" fill="none">
      {/* Crescent — the C, built from two offset circles */}
      <mask id="crescent-cut">
        <rect x="0" y="0" width="120" height="120" fill="white" />
        <circle cx="76" cy="62" r="30" fill="black" />
      </mask>
      <circle cx="62" cy="62" r="40" fill="currentColor" mask="url(#crescent-cut)" />

      {/* 7 — top bar + diagonal, the diagonal terminating where it meets the
          crescent's outer rim so the two read as one continuous stroke */}
      <path
        d="M 24 20 H 78 L 80 30 H 34 L 30 42 Q 20 55 22 30 Z"
        fill="currentColor"
      />
      <path
        d="M 78 20 L 34 96 L 24 92 L 66 22 Z"
        fill="currentColor"
      />

      {variant === 'full' && (
        <g opacity="0.9">
          {/* peak */}
          <path d="M 58 88 L 68 74 L 78 88 Z" fill="var(--logo-scene, #0B0D10)" />
          {/* figure */}
          <rect x="66.5" y="78" width="2.4" height="8" fill="var(--logo-scene, #0B0D10)" />
          {/* star */}
          <path
            d="M 70 44 L 71.6 48.4 L 76 50 L 71.6 51.6 L 70 56 L 68.4 51.6 L 64 50 L 68.4 48.4 Z"
            fill="var(--logo-scene, #0B0D10)"
          />
        </g>
      )}
    </svg>
  );
}
