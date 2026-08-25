import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { RealImage } from '@/components/RealImage';
import { ProjectReel } from '@/components/ProjectReel';
import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import corporateImg from '@/assets/stock/corporate.jpg';
import liveImg from '@/assets/stock/live-event.jpg';
import portfolioImg from '@/assets/stock/portfolio.jpg';

import weddingsVideoMp4 from '@/assets/video/projects/weddings.mp4';
import weddingsVideoWebm from '@/assets/video/projects/weddings.webm';
import eventsVideoMp4 from '@/assets/video/projects/events.mp4';
import eventsVideoWebm from '@/assets/video/projects/events.webm';
import advertisingVideoMp4 from '@/assets/video/projects/advertising.mp4';
import advertisingVideoWebm from '@/assets/video/projects/advertising.webm';
import portraitVideoMp4 from '@/assets/video/projects/portrait.mp4';
import portraitVideoWebm from '@/assets/video/projects/portrait.webm';
import commercialVideoMp4 from '@/assets/video/projects/commercial.mp4';
import commercialVideoWebm from '@/assets/video/projects/commercial.webm';
import musicVideoMp4 from '@/assets/video/projects/musicvideos.mp4';
import musicVideoWebm from '@/assets/video/projects/musicvideos.webm';

// Six categories of work, not six literal projects — each opens into a
// full-screen reel. Stand-in stock footage throughout (⚠️ replace with real
// client reels as they're delivered — see site/README.md); names are
// placeholders too, easy to swap once there's a real project to credit.
const PROJECTS = [
  {
    n: '01',
    name: 'Steel & Sparks',
    category: 'Commercial Films',
    img: industrialImg,
    videoMp4: commercialVideoMp4,
    videoWebm: commercialVideoWebm,
  },
  {
    n: '02',
    name: 'Two Lamps, One Night',
    category: 'Weddings',
    img: weddingImg,
    videoMp4: weddingsVideoMp4,
    videoWebm: weddingsVideoWebm,
  },
  {
    n: '03',
    name: 'Object of Desire',
    category: 'Advertising',
    img: productImg,
    videoMp4: advertisingVideoMp4,
    videoWebm: advertisingVideoWebm,
  },
  {
    n: '04',
    name: 'Before the Applause',
    category: 'Events',
    img: corporateImg,
    videoMp4: eventsVideoMp4,
    videoWebm: eventsVideoWebm,
  },
  {
    n: '05',
    name: 'Lights Down, Sound Up',
    category: 'Music Videos',
    img: liveImg,
    videoMp4: musicVideoMp4,
    videoWebm: musicVideoWebm,
  },
  {
    n: '06',
    name: 'Held, Not Posed',
    category: 'Portrait Photography',
    img: portfolioImg,
    videoMp4: portraitVideoMp4,
    videoWebm: portraitVideoWebm,
  },
];

// Sticky-stacking cards: each card pins and scales down slightly as the
// next one arrives underneath it — a film-reel layering effect. Clicking a
// card opens the full-screen reel viewer at that category.
export function ProjectsSection() {
  const total = PROJECTS.length;
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
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.n} project={p} index={i} total={total} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      {openIndex !== null && (
        <ProjectReel
          projects={PROJECTS}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Capped stacking offset: with six cards, `index * 28px` compounded on top
  // of the sticky offset pushed later cards' bottom-anchored title below the
  // fold on shorter viewports. Content is now clustered near the top instead
  // of spanning the full card height, so it's never at the mercy of exactly
  // how much of the card is visible.
  const stackOffset = Math.min(index, 3) * 14;

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
            src={project.img}
            alt={`${project.name} — ${project.category}, reference image`}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #11151A 0%, rgba(17,21,26,0.55) 30%, transparent 60%)' }}
        />

        <div className="relative flex h-full flex-col p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span
              className="font-display font-black leading-none text-[#C6A15B]/60"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.n}
            </span>
            <span onClick={(e) => e.stopPropagation()}>
              <GhostButton href="#contact" label="Enquire" />
            </span>
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#B6421D] sm:text-xs">{project.category}</p>
            <h3 className="mt-1 font-display text-2xl text-[#E6DECD] sm:text-4xl md:text-5xl">{project.name}</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#E6DECD]/50">Watch the reel →</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
