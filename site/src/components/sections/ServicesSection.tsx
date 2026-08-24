import { FadeIn } from '@/components/FadeIn';
import { CAPABILITIES, CATEGORIES } from '@/data/content';

// An index, not a grid of service cards — closer to a magazine contents
// page than the boxed "what we offer" tiles a template would reach for.
export function ServicesSection() {
  return (
    <section id="services" className="bg-ink px-5 py-20 sm:px-8 sm:py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">What we do</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight text-[#E6DECD] sm:text-5xl">
              Twenty things, <span className="hero-heading italic">one standard.</span>
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-8 sm:gap-10">
            {CATEGORIES.map((cat, i) => {
              const items = CAPABILITIES.filter((c) => c.category === cat);
              return (
                <FadeIn key={cat} delay={i * 0.08}>
                  <div className="border-t border-[#767F83]/15 pt-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#C6A15B]">{cat}</p>
                    <p className="mt-3 font-display text-xl italic leading-relaxed text-[#E6DECD] sm:text-2xl">
                      {items.map((it, idx) => (
                        <span key={it.name}>
                          {it.name}
                          {idx < items.length - 1 && <span className="mx-2 text-[#767F83]">·</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
