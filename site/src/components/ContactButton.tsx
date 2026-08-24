interface ContactButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

// Gold/ember gradient — the studio's real palette, not the MotionSites
// reference's purple-magenta gradient, which belonged to a different brand.
export function ContactButton({ href = '#contact', label = 'Start a Project', className }: ContactButtonProps) {
  return (
    <a
      href={href}
      className={
        'inline-flex items-center justify-center rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 ' +
        'text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-ink ' +
        'transition-transform duration-200 hover:-translate-y-0.5 ' +
        (className ?? '')
      }
      style={{
        background: 'linear-gradient(123deg, #F7E7B8 7%, #C9A84C 45%, #A67C1E 72%, #D9541E 100%)',
        boxShadow: '0px 4px 12px rgba(201, 168, 76, 0.35), inset 0px 2px 6px rgba(255, 255, 255, 0.25)',
      }}
    >
      {label}
    </a>
  );
}
