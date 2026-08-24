interface LogoProps {
  className?: string;
}

// ⚠️ PLACEHOLDER — a simple "7C" monogram standing in for the real mark.
// The real logo exists (see ../brand/identity.md and identity-brief.md in the
// repo root) but this environment cannot fetch it — it's AI-generated with no
// vector master and only reachable via a Lovable preview URL this sandbox's
// network policy blocks. Swap this for the real redrawn SVG per
// brand/identity-brief.md Direction A once it exists.
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-label="7th Creation">
      <circle cx="22" cy="22" r="21" fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.5" />
      <text
        x="22"
        y="29"
        textAnchor="middle"
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="20"
        fontWeight="500"
        fill="#C9A84C"
      >
        7C
      </text>
    </svg>
  );
}
