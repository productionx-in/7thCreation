import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ShutterCursor } from '@/components/ShutterCursor';

// Section order per the reused MotionSites structure: Hero, Marquee, About,
// Services, Projects — with Process and Contact appended, carried over from
// the real Lovable build (seventh-creation-studio.lovable.app).
export default function App() {
  return (
    <main className="bg-ink" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
      <WhatsAppButton />
      <ShutterCursor />
    </main>
  );
}
