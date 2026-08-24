import { FadeIn } from '@/components/FadeIn';
import { Magnet } from '@/components/Magnet';
import { ContactButton } from '@/components/ContactButton';
import { NAV, HERO } from '@/data/content';
import { Logo } from '@/components/Logo';
import { RealImage } from '@/components/RealImage';
import heroVision from '@/assets/stock/hero-vision.jpg';

export function HeroSection() {
  return (
    <section className="grain-overlay relative flex h-screen flex-col overflow-hidden bg-ink">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} as="nav">
        <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <a href="#top" className="flex items-center gap-3">
            <Logo variant="full" className="h-9 w-9 text-[#C6A15B] md:h-11 md:w-11" />
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
        </div>
      </FadeIn>

      {/* Heading */}
      <div className="relative z-10 mt-auto flex flex-1 flex-col justify-center px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <p className="text-xs uppercase tracking-[0.35em] text-[#767F83] md:text-sm">{HERO.eyebrow}</p>
        </FadeIn>
        <div className="overflow-hidden">
          <FadeIn delay={0.2} y={40}>
            <h1 className="hero-heading mt-3 font-display text-[13vw] font-light leading-[0.92] sm:text-[10vw] md:text-[7.5vw] lg:text-[6.5rem] xl:text-[7.5rem]">
              {HERO.headingLine1}
              <br />
              <span className="italic">{HERO.headingLine2}</span>
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20} className="max-w-[220px] sm:max-w-[320px] md:max-w-[420px]">
          <p className="text-xs font-light leading-snug tracking-wide text-[#767F83] sm:text-sm md:text-base">
            {HERO.sub}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <a
            href="#services"
            className="hidden whitespace-nowrap text-xs font-medium uppercase tracking-widest text-[#E6DECD]/80 transition-colors hover:text-[#E6DECD] sm:inline"
          >
            {HERO.ctaSecondary}
          </a>
          <ContactButton href="#work" label={HERO.ctaPrimary} />
        </FadeIn>
      </div>

      {/* Portrait — magnetic hover, licensed reference photo */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end pr-0 sm:pr-6 md:pr-12">
        <div className="pointer-events-auto w-[55vw] max-w-[320px] opacity-90 sm:w-[38vw] sm:max-w-[420px] md:max-w-[480px]">
          <Magnet padding={150} strength={5}>
            <div className="relative rounded-t-full" style={{ aspectRatio: '3 / 4' }}>
              <RealImage
                src={heroVision}
                alt="Silhouetted figure on a mountain ridge at sunset — reference image"
                className="h-full w-full rounded-t-full"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-t-full"
                style={{ background: 'linear-gradient(to top, #11151A 0%, transparent 45%, rgba(17,21,26,0.35) 100%)' }}
              />
            </div>
          </Magnet>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 hidden justify-center sm:flex">
        <span className="animate-pulse text-[0.65rem] uppercase tracking-[0.4em] text-[#767F83]">Scroll</span>
      </div>
    </section>
  );
}
