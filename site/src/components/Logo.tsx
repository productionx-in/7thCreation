import logoMark from '@/assets/logo/logo-mark.png';

interface LogoProps {
  className?: string;
}

// The real commissioned mark — gold 7 unified with a stone crescent framing
// a standing figure, mountains and a single star. Supplied by the founder;
// background-removed and cropped to a tight transparent PNG for web use.
export function Logo({ className }: LogoProps) {
  return <img src={logoMark} alt="7th Creation" className={className} style={{ objectFit: 'contain' }} />;
}
