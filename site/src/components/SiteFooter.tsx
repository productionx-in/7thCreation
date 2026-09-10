import { Instagram, Youtube } from 'lucide-react';
import { useContactInfo } from '@/lib/SiteOverridesContext';
import { Logo } from '@/components/Logo';

// Shared footer for the landing page's contact section and the standalone
// blog pages. The admin sign-in link lives here deliberately — small,
// unlabeled-to-the-eye, easy to miss for a browsing client, easy to find
// for the one person who knows to look for it.
export function SiteFooter() {
  const CONTACT = useContactInfo();
  return (
    <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-t border-[#767F83]/10 px-5 py-8 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left md:px-10">
      <div className="flex items-center gap-3">
        <Logo className="h-7 w-7" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#767F83]">A Creative Studio</span>
      </div>
      <div className="flex items-center gap-4 text-[#767F83]">
        <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#E6DECD]">
          <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </a>
        <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#E6DECD]">
          <Youtube className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </a>
      </div>
      <p className="text-xs text-[#767F83]">
        © {new Date().getFullYear()} 7th Creation ·{' '}
        <a href="/admin" className="text-[#767F83]/60 hover:text-[#767F83]">
          Studio sign-in
        </a>
      </p>
    </footer>
  );
}
