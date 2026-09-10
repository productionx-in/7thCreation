import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CinematicIntro } from '@/components/CinematicIntro';

// Section order per the reused MotionSites structure: Hero, Marquee, About,
// Services, Projects — with Process and Contact appended, carried over from
// the real Lovable build (seventh-creation-studio.lovable.app).
export function LandingPage() {
  return (
    <>
      <CinematicIntro />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
