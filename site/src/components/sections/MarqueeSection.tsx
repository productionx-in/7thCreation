import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { MockPlate } from '@/components/MockPlate';
import { RealImage } from '@/components/RealImage';
import { MARQUEE_ROW_1, MARQUEE_ROW_2, type MockImage } from '@/data/images';

function tripled<T>(arr: T[]): T[] {
  return [...arr, ...arr, ...arr];
}

// Two rows of tiles translating opposite directions, tied to scroll position
// (plain scroll listener — no animation library needed for this).
export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const val = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(val);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const row1 = tripled(MARQUEE_ROW_1);
  const row2 = tripled(MARQUEE_ROW_2);

  const tileClass = 'group relative h-[170px] w-[260px] flex-shrink-0 overflow-hidden rounded-lg border border-[#767F83]/20 sm:h-[210px] sm:w-[320px] md:h-[250px] md:w-[380px]';

  return (
    <section ref={sectionRef} className="bg-ink pb-10 pt-20 sm:pt-24 md:pt-28">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">The full range</p>
          <h2 className="mt-3 font-display text-2xl font-light text-[#E6DECD] sm:text-3xl">Twenty things we shoot</h2>
        </FadeIn>
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:mt-12">
        <Row images={row1} offset={offset - 200} tileClass={tileClass} />
        <Row images={row2} offset={-(offset - 200)} tileClass={tileClass} />
      </div>
    </section>
  );
}

function Row({ images, offset, tileClass }: { images: MockImage[]; offset: number; tileClass: string }) {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3" style={{ transform: `translateX(${offset}px)`, willChange: 'transform' }}>
        {images.map((img, i) =>
          img.photo ? (
            <div key={i} className={tileClass}>
              <RealImage src={img.photo} alt={`${img.label} — reference image`} className="h-full w-full" />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3"
                style={{ background: 'linear-gradient(to top, rgba(17,21,26,0.85), transparent)' }}
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#E6DECD]">{img.label}</span>
              </div>
            </div>
          ) : (
            <MockPlate key={i} label={img.label} icon={img.icon} className={tileClass} />
          ),
        )}
      </div>
    </div>
  );
}
