import { Instagram, Youtube } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/ContactButton';
import { NAV, HERO, CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';
import { RealImage } from '@/components/RealImage';
import heroVision from '@/assets/stock/hero-vision.jpg';

const CORNER_POS = ['left-4 top-20 border-l border-t sm:left-6 sm:top-24', 'right-4 top-20 border-r border-t sm:right-6 sm:top-24', 'left-4 bottom-6 border-l border-b sm:left-6', 'right-4 bottom-6 border-r border-b sm:right-6'];

export function HeroSection() {
  return (
    <section id="top" className="grain-overlay relative flex h-screen min-h-[640px] flex-col overflow-hidden bg-ink">
      {/* Full-bleed reference frame — the hero *is* the "frame worth keeping".
          RealImage hardcodes `relative`; passing `absolute` straight into its
          className loses the position-utility tie-break in Tailwind's
          cascade, so the outer wrapper carries `absolute inset-0` instead. */}
      <div className="absolute inset-0">
        <RealImage
          src={heroVision}
          alt="Silhouetted figure on a mountain ridge at sunset — reference image"
          className="h-full w-full"
          tag={false}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(17,21,26,0.75) 0%, rgba(17,21,26,0.25) 30%, rgba(17,21,26,0.35) 65%, rgba(17,21,26,0.92) 100%)',
        }}
      />

      {/* Viewfinder corner brackets — the literal "frame" the tagline names */}
      {CORNER_POS.map((pos) => (
        <span key={pos} className={`pointer-events-none absolute hidden h-10 w-10 border-[#E6DECD]/25 sm:block ${pos}`} />
      ))}

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
