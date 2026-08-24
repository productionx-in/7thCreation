import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { MockPlate } from '@/components/MockPlate';
import { PROJECTS } from '@/data/images';

// Sticky-stacking cards, reused from the MotionSites reference: each card
// pins and scales down slightly as the next one arrives underneath it.
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
            Project
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

  return (
    <div ref={ref} className="sticky top-20 mb-7 h-[85vh] sm:top-24 md:top-28">
      <motion.div
        style={{ scale, top: `${index * 28}px` }}
        className="relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-[#D7CBAE]/40 bg-ink p-4 sm:rounded-[44px] sm:p-6 md:rounded-[56px] md:p-8"
      >
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span
              className="font-display font-black leading-none text-[#B99B4A]/30"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.n}
            </span>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#D9541E] sm:text-xs">
                {project.category} · {project.kind}
              </p>
              <h3 className="mt-1 font-display text-xl text-[#EFE4C6] sm:text-2xl md:text-3xl">{project.name}</h3>
            </div>
          </div>
          <GhostButton href="#contact" label="Enquire" />
        </div>

        {/* Image grid — mock footage */}
        <div className="mt-4 flex flex-1 gap-3 sm:mt-6 md:mt-8">
          <div className="flex w-2/5 flex-col gap-3">
            <MockPlate
              label={project.images.col1[0].label}
              icon={project.images.col1[0].icon}
              className="w-full flex-shrink-0 rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
              style={{ height: 'clamp(100px, 16vw, 200px)' }}
            />
            <MockPlate
              label={project.images.col1[1].label}
              icon={project.images.col1[1].icon}
              className="w-full flex-1 rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
              style={{ minHeight: 0 }}
            />
          </div>
          <MockPlate
            label={project.images.col2.label}
            icon={project.images.col2.icon}
            className="w-3/5 rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
          />
        </div>
      </motion.div>
    </div>
  );
}
