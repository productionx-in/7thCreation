import { useEffect, useRef } from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/ContactButton';
import { NAV, HERO, CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';
import heroLogoWebm from '@/assets/video/hero-logo.webm';
import heroLogoMp4 from '@/assets/video/hero-logo.mp4';
import heroPoster from '@/assets/video/hero-poster.jpg';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Plays once on landing, then holds on its last frame — the formed 7C
  // mark — instead of scrubbing with scroll (that read as janky).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <section id="top" className="grain-overlay relative flex h-screen min-h-[640px] flex-col overflow-hidden bg-ink">
      {/* The logo reveal itself — full-bleed, no frame, plays once on load */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={heroPoster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroLogoWebm} type="video/webm" />
        <source src={heroLogoMp4} type="video/mp4" />
      </video>
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
