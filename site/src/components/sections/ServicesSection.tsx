import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { useServices } from '@/lib/SiteOverridesContext';

// Same numbered-list device as the MotionSites reference, restyled dark/gold
// to match the studio's real identity instead of the reference's black-on-
// white treatment, and populated with the actual five service groups.
export function ServicesSection() {
  const [hover, setHover] = useState<number | null>(null);
  const services = useServices();

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
        {services.map((s, i) => {
          const active = hover === i;
          return (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group flex items-start gap-4 border-t border-[#767F83]/15 py-5 last:border-b hover:bg-[#E6DECD]/[0.03] sm:gap-6 sm:py-6 md:py-7"
              >
                <span
                  className={`flex-shrink-0 font-display font-black leading-none transition-colors duration-300 ${active ? 'text-[#C6A15B]/70' : 'text-[#C6A15B]/30'}`}
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 56px)' }}
                >
                  {s.n}
                </span>
                <div className="flex flex-1 flex-col gap-1.5 pt-1 sm:gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`font-medium uppercase tracking-wide transition-colors duration-300 ${active ? 'text-[#C6A15B]' : 'text-[#E6DECD]'}`}
                      style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.35rem)' }}
                    >
                      {s.name}
                    </h3>
                    <ArrowUpRight
                      className={`h-5 w-5 flex-shrink-0 text-[#C6A15B] transition-all duration-300 ${active ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-1 translate-y-1 opacity-0'}`}
                    />
                  </div>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-[#767F83]"
                    style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)' }}
                  >
                    {s.copy}
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
