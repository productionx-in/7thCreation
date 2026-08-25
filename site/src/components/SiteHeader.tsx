import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { NAV } from '@/data/content';

// Plain header for standalone pages (blog, post) that aren't the hero.
// The landing page keeps its own nav baked into HeroSection — this is for
// everywhere else, where there's no video behind the text to design around.
export function SiteHeader() {
  return (
    <header className="border-b border-[#767F83]/15 bg-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 md:h-9 md:w-9" />
          <span className="font-display text-sm uppercase tracking-[0.3em] text-[#E6DECD] md:text-base">
            7th Creation
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={`/${n.href}`}
              className="text-sm font-medium uppercase tracking-wider text-[#E6DECD] transition-opacity duration-200 hover:opacity-70"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/blog"
            className="text-sm font-medium uppercase tracking-wider text-[#C6A15B] transition-opacity duration-200 hover:opacity-70"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
