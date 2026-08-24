import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/ContactButton';
import { RealImage } from '@/components/RealImage';
import { ABOUT_COPY } from '@/data/content';
import productImg from '@/assets/stock/product-podium.jpg';

// A manifesto spread, not a centered mission-statement paragraph — the
// asymmetric text/photo split reads like a magazine page rather than a
// template "about us" block.
export function AboutSection() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-8 sm:py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-16">
        <div>
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">Who we are</p>
          </FadeIn>
          <FadeIn delay={0.1} y={40}>
            <p className="mt-6 font-display text-[clamp(1.6rem,4vw,3rem)] font-light leading-[1.2] text-[#E6DECD]">
              {ABOUT_COPY}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-10">
              <ContactButton label="Start a project" />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} x={40} y={0}>
          <div className="overflow-hidden rounded-lg border border-[#767F83]/20" style={{ aspectRatio: '4 / 5' }}>
            <RealImage src={productImg} alt="Product on a lit podium — reference image" className="h-full w-full" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
