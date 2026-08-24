import { useEffect, useRef, useState } from 'react';
import { MockPlate } from '@/components/MockPlate';
import { RealImage } from '@/components/RealImage';
import { MARQUEE_ROW_1, MARQUEE_ROW_2, type MockImage } from '@/data/images';

function tripled<T>(arr: T[]): T[] {
  return [...arr, ...arr, ...arr];
}

// Reused from the MotionSites reference pattern: two rows of tiles that
// translate opposite directions based on scroll position (not a CSS loop).
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

  const tileClass =
    'h-[180px] w-[280px] flex-shrink-0 rounded-2xl sm:h-[220px] sm:w-[340px] md:h-[270px] md:w-[420px]';

  return (
    <section ref={sectionRef} className="bg-ink pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
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
            <RealImage key={i} src={img.photo} alt={`${img.label} — reference image`} className={`${tileClass} rounded-2xl`} />
          ) : (
            <MockPlate key={i} label={img.label} icon={img.icon} className={tileClass} />
          ),
        )}
      </div>
    </div>
  );
}
