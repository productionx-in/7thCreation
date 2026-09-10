import { Aperture, Clapperboard, Camera, Film } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { AnimatedText } from '@/components/AnimatedText';
import { ContactButton } from '@/components/ContactButton';
import { useAboutCopy } from '@/lib/SiteOverridesContext';

// Corner accents use lucide icons rather than the MotionSites reference's 3D
// render props (moon, lego brick) — those belonged to a "3D creator" persona
// and had no connection to a photography and film studio.
const CORNERS = [
  { Icon: Aperture, pos: 'left-[4%] top-[6%] sm:left-[6%]', delay: 0.1, x: -60 },
  { Icon: Film, pos: 'right-[4%] top-[6%] sm:right-[6%]', delay: 0.15, x: 60 },
  { Icon: Camera, pos: 'bottom-[8%] left-[6%] sm:left-[10%]', delay: 0.25, x: -60 },
  { Icon: Clapperboard, pos: 'bottom-[8%] right-[6%] sm:right-[10%]', delay: 0.3, x: 60 },
];

export function AboutSection() {
  const aboutCopy = useAboutCopy();
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-5 py-20 sm:px-8 md:px-10">
      {CORNERS.map(({ Icon, pos, delay, x }, i) => (
        <FadeIn key={i} delay={delay} x={x} y={0} duration={0.9} className={`pointer-events-none absolute hidden ${pos} md:block`}>
          <Icon className="h-16 w-16 text-[#C6A15B]/25 md:h-20 md:w-20" strokeWidth={1} />
        </FadeIn>
      ))}

      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading text-center font-display font-light leading-none" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          About us
        </h2>
      </FadeIn>

      <div className="mt-10 flex max-w-[600px] flex-col items-center gap-10 sm:mt-14 sm:gap-14 md:mt-16 md:gap-16">
        <AnimatedText
          text={aboutCopy}
          className="text-center font-medium leading-relaxed text-[#E6DECD] text-[clamp(1rem,2vw,1.35rem)]"
        />
        <ContactButton />
      </div>
    </section>
  );
}
