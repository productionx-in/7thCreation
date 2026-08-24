import { FadeIn } from '@/components/FadeIn';
import { GhostButton } from '@/components/GhostButton';
import { CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';

export function ContactSection() {
  return (
    <section id="contact" className="grain-overlay relative border-t border-[#D7CBAE]/15 bg-[#12100B]">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#B99B4A]">Start a project</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight text-[#EFE4C6] sm:text-5xl">
            Tell us what you want people to feel.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href={`mailto:${CONTACT.email}`} className="text-[#C9A84C] hover:text-[#E4CD8C]">
              {CONTACT.email}
            </a>
            <span className="text-[#8A7E63]">{CONTACT.location}</span>
          </div>
          <div className="mt-8">
            <GhostButton href={`mailto:${CONTACT.email}`} label="Send the brief" />
          </div>
        </FadeIn>
      </div>

      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-t border-[#D7CBAE]/10 px-5 py-8 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left md:px-10">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#8A7E63]">A Creative Studio</span>
        </div>
        <p className="text-xs text-[#8A7E63]">© {new Date().getFullYear()} 7th Creation</p>
      </footer>
    </section>
  );
}
