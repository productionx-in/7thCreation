import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// Lead with proof (the work), then breadth (everything we shoot), then who
// we are, what we do, and how — closing on contact.
export default function App() {
  return (
    <main className="bg-ink" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <ProjectsSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ContactSection />
      <WhatsAppButton />
    </main>
  );
}
