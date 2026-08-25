import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { RealImage } from '@/components/RealImage';
import { CategoryGallery } from '@/components/CategoryGallery';
import { WORK_CATEGORIES, type WorkCategory } from '@/data/workCategories';

// Six disciplines, not six literal projects — each card opens a full-screen
// gallery/carousel of clips for that category. Stand-in stock footage
// throughout (⚠️ replace with real client reels as they're delivered — see
// site/README.md).
export function ProjectsSection() {
  const total = WORK_CATEGORIES.length;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="work" className="relative -mt-10 rounded-t-[40px] bg-ink pb-10 pt-16 sm:-mt-12 sm:rounded-t-[50px] sm:pt-20 md:-mt-14 md:rounded-t-[60px] md:pt-24">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn>
          <h2
            className="hero-heading font-display font-light leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Selected work
          </h2>
        </FadeIn>
      </div>

      <div className="relative mt-10 px-5 sm:px-8 md:px-10">
        {WORK_CATEGORIES.map((c, i) => (
          <CategoryCard key={c.slug} category={c} index={i} total={total} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      {openIndex !== null && (
        <CategoryGallery category={WORK_CATEGORIES[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}

function CategoryCard({
  category,
  index,
  total,
  onOpen,
}: {
  category: WorkCategory;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const stackOffset = Math.min(index, 3) * 14;
  const count = category.items.length;

  return (
    <div ref={ref} className="sticky top-20 mb-7 h-[85vh] sm:top-24 md:top-28">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
        style={{ scale, top: `${stackOffset}px` }}
        className="group relative h-full cursor-pointer overflow-hidden rounded-[32px] border-2 border-[#767F83]/40 bg-ink sm:rounded-[44px] md:rounded-[56px]"
      >
        {/* RealImage hardcodes `relative`; passing `absolute` straight into
            its className loses the position-utility tie-break in Tailwind's
            cascade (`.relative` is defined after `.absolute` and wins),
            so the outer wrapper carries `absolute inset-0` instead. */}
        <div className="absolute inset-0">
          <RealImage
            src={category.img}
            alt={`${category.name} — reference image`}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #11151A 0%, rgba(17,21,26,0.6) 30%, transparent 60%)' }}
        />

        <div className="relative flex h-full flex-col p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span
              className="font-display font-black leading-none text-[#C6A15B]/60"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {category.n}
            </span>
            <span onClick={(e) => e.stopPropagation()}>
              <GhostButton href="#contact" label="Enquire" />
            </span>
          </div>

          <div className="mt-4 sm:mt-6">
            <h3 className="font-display leading-none text-[#E6DECD]" style={{ fontSize: 'clamp(1.8rem, 5.5vw, 4.2rem)' }}>
              {category.name}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#E6DECD]/60 sm:text-base">
              {category.blurb}
            </p>
            {count > 0 && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C6A15B]">
                <Play className="h-3 w-3 fill-current" />
                {count} {count === 1 ? 'piece' : 'pieces'} — view gallery
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
