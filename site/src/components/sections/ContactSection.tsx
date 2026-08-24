import { Instagram, Youtube } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import { CONTACT } from '@/data/content';
import { Logo } from '@/components/Logo';
import { EnquiryForm } from '@/components/EnquiryForm';

export function ContactSection() {
  return (
    <section id="contact" className="grain-overlay relative border-t border-[#767F83]/15 bg-[#0D1015]">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">Start a project</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight text-[#E6DECD] sm:text-5xl">
            Tell us what you want people to feel.
          </h2>
          <p className="mt-3 text-sm text-[#767F83]">
            Fill this in and it goes straight to our WhatsApp — or reach us directly at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-[#C6A15B] hover:text-[#E4CFA0]">
              {CONTACT.email}
            </a>{' '}
            /{' '}
            <a href={CONTACT.phoneHref} className="text-[#C6A15B] hover:text-[#E4CFA0]">
              {CONTACT.phone}
            </a>
            .
          </p>
          <div className="mt-10">
            <EnquiryForm />
          </div>
        </FadeIn>
      </div>

      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-t border-[#767F83]/10 px-5 py-8 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left md:px-10">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#767F83]">A Creative Studio</span>
        </div>
        <div className="flex items-center gap-4 text-[#767F83]">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#E6DECD]">
            <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </a>
          <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#E6DECD]">
            <Youtube className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </a>
        </div>
        <p className="text-xs text-[#767F83]">© {new Date().getFullYear()} 7th Creation</p>
      </footer>
    </section>
  );
}
