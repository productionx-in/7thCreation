import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { RealImage } from '@/components/RealImage';
import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import corporateImg from '@/assets/stock/corporate.jpg';
import liveImg from '@/assets/stock/live-event.jpg';
import documentaryImg from '@/assets/stock/documentary.jpg';

// Real, licensed reference photography — see RealImage.tsx. One full-bleed
// image per card rather than a mixed grid: editorial and legible, and it
// doesn't force mismatched real/placeholder frames into the same card. Six
// entries spans the business's core pillars without turning an 85vh-per-card
// sticky stack into a scroll marathon — the 20-item marquee already covers
// full breadth.
const PROJECTS = [
  { n: '01', name: 'Steel & Sparks', category: 'Industrial Film', kind: 'Client', img: industrialImg },
  { n: '02', name: 'Two Lamps, One Night', category: 'Wedding', kind: 'Client', img: weddingImg },
  { n: '03', name: 'Object of Desire', category: 'Product', kind: 'Client', img: productImg },
  { n: '04', name: 'Before the Applause', category: 'Corporate Event', kind: 'Client', img: corporateImg },
  { n: '05', name: 'Lights Down, Sound Up', category: 'Live Coverage', kind: 'Client', img: liveImg },
  { n: '06', name: 'Nobody Was Acting', category: 'Documentary', kind: 'Client', img: documentaryImg },
];

// Sticky-stacking cards: each card pins and scales down slightly as the
// next one arrives underneath it — a film-reel layering effect.
export function ProjectsSection() {
  const total = PROJECTS.length;
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
          <ProjectCard key={p.n} project={p} index={i} total={total} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  total: number;
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
        style={{ scale, top: `${stackOffset}px` }}
        className="relative h-full overflow-hidden rounded-[32px] border-2 border-[#767F83]/40 bg-ink sm:rounded-[44px] md:rounded-[56px]"
      >
        {/* RealImage hardcodes `relative`; passing `absolute` straight into
            its className loses the position-utility tie-break in Tailwind's
            cascade (`.relative` is defined after `.absolute` and wins),
            so the outer wrapper carries `absolute inset-0` instead. */}
        <div className="absolute inset-0">
          <RealImage
            src={project.img}
            alt={`${project.name} — ${project.category}, reference image`}
            className="h-full w-full"
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
            <GhostButton href="#contact" label="Enquire" />
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#B6421D] sm:text-xs">
              {project.category} · {project.kind}
            </p>
            <h3 className="mt-1 font-display text-2xl text-[#E6DECD] sm:text-4xl md:text-5xl">{project.name}</h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
