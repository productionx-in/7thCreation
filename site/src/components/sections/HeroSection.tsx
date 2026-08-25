import { Instagram, Youtube } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/ContactButton';
import { NAV, HERO, CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';
import heroBtsWebm from '@/assets/video/hero-bts.webm';
import heroBtsMp4 from '@/assets/video/hero-bts.mp4';
import heroPoster from '@/assets/video/hero-poster.jpg';

export function HeroSection() {
  return (
    <section id="top" className="grain-overlay relative flex h-screen min-h-[640px] flex-col overflow-hidden bg-ink">
      {/* Licensed reference footage — a photographer silhouetted against a
          desert sunset, shot from behind. A true silhouette (no face, no
          ethnicity implied) rather than a close-up of a specific person,
          since the studio is India-based and the earlier close-up shots
          read as a mismatch. Wide open sky on the right leaves the text
          plenty of clean, low-detail space regardless of where playback
          lands. Ambient, so it loops. */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroPoster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroBtsWebm} type="video/webm" />
        <source src={heroBtsMp4} type="video/mp4" />
      </video>
      <span className="pointer-events-none absolute right-6 top-24 z-10 hidden text-[0.55rem] font-medium uppercase tracking-[0.2em] text-[#E6DECD]/40 sm:block md:right-10">
        Reference footage
      </span>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(17,21,26,0.7) 0%, rgba(17,21,26,0.15) 30%, rgba(17,21,26,0.25) 60%, rgba(17,21,26,0.92) 100%)',
        }}
      />

      <FadeIn delay={0} y={-20} as="nav" className="relative z-10">
        <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <a href="#top" className="flex items-center gap-3">
            <Logo className="h-9 w-9 md:h-11 md:w-11" />
            <span className="font-display text-sm uppercase tracking-[0.3em] text-[#E6DECD] md:text-base">
              7th Creation
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium uppercase tracking-wider text-[#E6DECD] transition-opacity duration-200 hover:opacity-70 lg:text-[1.1rem]"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/blog"
              className="text-sm font-medium uppercase tracking-wider text-[#C6A15B] transition-opacity duration-200 hover:opacity-70 lg:text-[1.1rem]"
            >
              Blog
            </a>
          </div>
          <div className="flex items-center gap-4 text-[#E6DECD]/80">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#E6DECD]">
              <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
            <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#E6DECD]">
              <Youtube className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </FadeIn>

      <div className="relative z-10 mt-auto flex flex-col gap-6 px-6 pb-10 md:px-10 md:pb-14">
        <FadeIn delay={0.1} y={30}>
          <p className="text-xs uppercase tracking-[0.35em] text-[#E6DECD]/70 md:text-sm">{HERO.eyebrow}</p>
        </FadeIn>
        <div className="overflow-hidden">
          <FadeIn delay={0.2} y={50}>
            <h1 className="hero-heading max-w-4xl font-display text-[13vw] font-light leading-[0.92] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5rem] xl:text-[6.25rem]">
              {HERO.headingLine1}
              <br />
              <span className="italic">{HERO.headingLine2}</span>
            </h1>
          </FadeIn>
        </div>
        <FadeIn delay={0.35} y={20} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[380px] text-xs font-light leading-snug tracking-wide text-[#E6DECD]/60 sm:text-sm md:text-base">
            {HERO.sub}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#services"
              className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-[#E6DECD]/80 transition-colors hover:text-[#E6DECD] sm:text-sm"
            >
              {HERO.ctaSecondary}
            </a>
            <ContactButton href="#work" label={HERO.ctaPrimary} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
