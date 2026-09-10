import { FadeIn } from '@/components/FadeIn';
import { useContactInfo } from '@/lib/SiteOverridesContext';
import { EnquiryForm } from '@/components/EnquiryForm';
import { SiteFooter } from '@/components/SiteFooter';

export function ContactSection() {
  const CONTACT = useContactInfo();
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
          <p className="mt-1 text-sm text-[#767F83]">Based in {CONTACT.location}.</p>
          <div className="mt-10">
            <EnquiryForm />
          </div>
        </FadeIn>
      </div>

      <SiteFooter />
    </section>
  );
}
