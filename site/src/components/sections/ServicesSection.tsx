import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { FLAGSHIP_SERVICES } from '@/data/content';

// Same numbered-list device as the MotionSites reference, restyled dark/gold
// to match the studio's real identity instead of the reference's black-on-
// white treatment, and populated with the actual five service groups.
export function ServicesSection() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="services" className="bg-ink px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <FadeIn>
        <h2
          className="hero-heading text-center font-display font-light leading-none"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto mt-16 max-w-5xl sm:mt-20 md:mt-28">
        {FLAGSHIP_SERVICES.map((s, i) => {
          const active = hover === i;
          return (
            <FadeIn key={s.n} delay={i * 0.1}>
              <a
                href="#contact"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group flex items-start gap-6 border-t border-[#767F83]/15 py-8 pl-0 transition-[padding,background-color] duration-300 last:border-b hover:bg-[#E6DECD]/[0.03] hover:pl-3 sm:gap-10 sm:py-10 md:py-12"
              >
                <span
                  className={`flex-shrink-0 font-display font-black leading-none transition-colors duration-300 ${active ? 'text-[#C6A15B]/70' : 'text-[#C6A15B]/30'}`}
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
                >
                  {s.n}
                </span>
                <div className="flex flex-1 flex-col gap-2 pt-1 sm:gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`font-medium uppercase tracking-wide transition-colors duration-300 ${active ? 'text-[#C6A15B]' : 'text-[#E6DECD]'}`}
                      style={{ fontSize: 'clamp(1rem, 2.2vw, 1.9rem)' }}
                    >
                      {s.name}
                    </h3>
                    <ArrowUpRight
                      className={`h-6 w-6 flex-shrink-0 text-[#C6A15B] transition-all duration-300 ${active ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-1 translate-y-1 opacity-0'}`}
                    />
                  </div>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-[#767F83]"
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)' }}
                  >
                    {s.copy}
                  </p>
                </div>
              </a>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
