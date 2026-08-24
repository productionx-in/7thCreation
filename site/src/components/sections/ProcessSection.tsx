import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { PROCESS } from '@/data/content';

export function ProcessSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="process" className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">How it runs</p>
          <h2 className="mt-4 font-display text-3xl font-light text-[#E6DECD] sm:text-5xl">
            Calm sets make <span className="hero-heading italic">better films</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#767F83]">
            Every project moves through the same four beats, whether it is a two-hour product session or a
            three-day wedding.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
          {PROCESS.map((p, i) => (
            <button key={p.step} onClick={() => setOpen(i)} className="block w-full cursor-pointer px-1 py-6 text-left">
              <div className="flex items-baseline gap-5">
                <span className={`font-display text-sm ${open === i ? 'text-[#B6421D]' : 'text-[#767F83]'}`}>
                  {p.step}
                </span>
                <span className={`font-display text-2xl sm:text-3xl ${open === i ? 'text-[#C6A15B]' : 'text-[#E6DECD]'}`}>
                  {p.title}
                </span>
              </div>
              <div
                className="grid transition-all duration-500 ease-out"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
              >
                <p className="overflow-hidden pl-10 text-sm leading-relaxed text-[#767F83]">
                  <span className="block pt-3">{p.copy}</span>
                </p>
              </div>
            </button>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
