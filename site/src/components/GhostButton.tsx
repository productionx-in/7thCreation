interface GhostButtonProps {
  href?: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function GhostButton({ href, label, onClick, className }: GhostButtonProps) {
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D7C9A8]/50 px-6 py-2.5 sm:px-8 sm:py-3 ' +
    'text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7C9A8] ' +
    'transition-colors duration-200 hover:bg-[#D7C9A8]/10 ' +
    (className ?? '');
  if (href) {
    return (
      <a href={href} className={cls}>
        {label}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {label}
    </button>
  );
}
