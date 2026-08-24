import { FadeIn } from '@/components/FadeIn';
import { Magnet } from '@/components/Magnet';
import { ContactButton } from '@/components/ContactButton';
import { NAV, HERO } from '@/data/content';
import { Logo } from '@/components/Logo';
import { RealImage } from '@/components/RealImage';
import heroVision from '@/assets/stock/hero-vision.jpg';

export function HeroSection() {
  return (
    <section className="grain-overlay relative flex min-h-screen flex-col overflow-hidden bg-ink">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} as="nav">
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
        </div>
      </FadeIn>

      {/* Text + image, side by side on desktop, stacked on mobile */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-10 px-6 py-10 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-12 md:px-10 md:py-0">
        <div>
          <FadeIn delay={0.15} y={40}>
            <p className="text-xs uppercase tracking-[0.35em] text-[#767F83] md:text-sm">{HERO.eyebrow}</p>
          </FadeIn>
          <div className="overflow-hidden">
            <FadeIn delay={0.2} y={40}>
              <h1 className="hero-heading mt-3 font-display text-[13vw] font-light leading-[0.92] sm:text-[10vw] md:text-[5.5vw] lg:text-[4.75rem] xl:text-[5.5rem]">
                {HERO.headingLine1}
                <br />
                <span className="italic">{HERO.headingLine2}</span>
              </h1>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} y={20} className="mt-6 max-w-[420px] sm:mt-8">
            <p className="text-xs font-light leading-snug tracking-wide text-[#767F83] sm:text-sm md:text-base">
              {HERO.sub}
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20} className="mt-8 flex flex-wrap items-center gap-6 sm:mt-10">
            <ContactButton href="#work" label={HERO.ctaPrimary} />
            <a
              href="#services"
              className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-[#E6DECD]/80 transition-colors hover:text-[#E6DECD] sm:text-sm"
            >
              {HERO.ctaSecondary}
            </a>
          </FadeIn>
        </div>

        {/* Portrait — contained card, not a full-bleed crop */}
        <FadeIn delay={0.25} y={30} className="order-first md:order-last">
          <Magnet padding={120} strength={8} className="mx-auto block w-full max-w-[300px] sm:max-w-[380px] md:max-w-none">
            <div
              className="relative overflow-hidden rounded-[32px] border border-[#767F83]/25 sm:rounded-[40px]"
              style={{ aspectRatio: '4 / 5' }}
            >
              <RealImage
                src={heroVision}
                alt="Silhouetted figure on a mountain ridge at sunset — reference image"
                className="h-full w-full"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(17,21,26,0.5) 0%, transparent 35%)' }}
              />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="hidden justify-center pb-6 sm:flex">
        <span className="animate-pulse text-[0.65rem] uppercase tracking-[0.4em] text-[#767F83]">Scroll</span>
      </div>
    </section>
  );
}
