import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { RealImage } from '@/components/RealImage';
import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';

// Real, licensed reference photography — see RealImage.tsx.
const PROJECTS = [
  { n: '01', name: 'Steel & Sparks', category: 'Industrial Film', kind: 'Client', img: industrialImg },
  { n: '02', name: 'Two Lamps, One Night', category: 'Wedding', kind: 'Client', img: weddingImg },
  { n: '03', name: 'Object of Desire', category: 'Product', kind: 'Client', img: productImg },
];

// Alternating editorial rows instead of a scroll-scrubbed card stack — a
// magazine spread reads as intentional at any scroll speed, on any device,
// with no scroll-linked JS required.
export function ProjectsSection() {
  return (
    <section id="work" className="relative rounded-t-[40px] bg-[#0D1015] pb-10 pt-20 sm:rounded-t-[50px] sm:pt-24 md:rounded-t-[60px] md:pt-28">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">Selected work</p>
          <h2 className="mt-3 font-display text-3xl font-light text-[#E6DECD] sm:text-5xl">Frames we're proud of</h2>
        </FadeIn>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 sm:mt-16 sm:px-8 md:mt-20 md:px-10">
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.n} project={p} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project, reverse }: { project: (typeof PROJECTS)[number]; reverse: boolean }) {
  return (
    <FadeIn>
      <div
        className={`group grid items-center gap-8 border-t border-[#767F83]/15 py-10 last:border-b sm:gap-10 sm:py-14 md:grid-cols-2 md:gap-16 md:py-16 ${
          reverse ? 'md:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-[#767F83]/20" style={{ aspectRatio: '16 / 10' }}>
          <RealImage
            src={project.img}
            alt={`${project.name} — ${project.category}, reference image`}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div>
          <span className="font-display text-6xl font-black leading-none text-[#C6A15B]/25 sm:text-8xl">{project.n}</span>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[#B6421D] sm:text-xs">
            {project.category} · {project.kind}
          </p>
          <h3 className="mt-2 font-display text-2xl text-[#E6DECD] sm:text-4xl">{project.name}</h3>
          <div className="mt-6">
            <GhostButton href="#contact" label="Enquire" />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
