// Real copy and structure, carried over from the published Lovable build
// (seventh-creation-studio.lovable.app) — see brand/resolution-2026-08-24.md
// for how this was confirmed as the actual business.

export type Category = 'Photo & Film' | 'Events' | 'Brand' | 'Digital';

export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const CAPABILITIES: { name: string; category: Category; note: string }[] = [
  { name: 'Industrial Shoots', category: 'Photo & Film', note: 'Factories, plants, process films' },
  { name: 'Wedding Shoots', category: 'Photo & Film', note: 'Full-day candid & cinematic' },
  { name: 'Pre-Wedding', category: 'Photo & Film', note: 'Story-led location films' },
  { name: 'Ad Films', category: 'Photo & Film', note: 'Script to final grade' },
  { name: 'Reels', category: 'Digital', note: 'Short-form built to travel' },
  { name: 'Birthday Parties', category: 'Events', note: 'Candid coverage & highlights' },
  { name: 'Corporate Events', category: 'Events', note: 'Conferences, launches, AGMs' },
  { name: 'Live Coverage', category: 'Events', note: 'Multi-cam live production' },
  { name: 'LED Walls', category: 'Events', note: 'Screens, feeds & content' },
  { name: 'DJ & Sound', category: 'Events', note: 'Artist, rig and show flow' },
  { name: 'Documentary', category: 'Photo & Film', note: 'Long-form, real people' },
  { name: 'Podcast Videos', category: 'Digital', note: 'Multi-cam studio setups' },
  { name: 'Product Shoots', category: 'Photo & Film', note: 'Tabletop, e-comm, hero stills' },
  { name: 'Baby Shoots', category: 'Photo & Film', note: 'Newborn & milestone sessions' },
  { name: 'Portfolio Shoots', category: 'Photo & Film', note: 'Actors, models, founders' },
  { name: 'Brand Content', category: 'Brand', note: 'Always-on content systems' },
  { name: 'Brand Marketing', category: 'Brand', note: 'Campaigns, positioning, launch' },
  { name: 'Logo & Identity', category: 'Brand', note: 'Marks, systems, guidelines' },
  { name: 'Web Development', category: 'Digital', note: 'Fast, bespoke websites' },
  { name: 'Social Management', category: 'Digital', note: 'Calendar, edit, publish, report' },
];

export const CATEGORIES: Category[] = ['Photo & Film', 'Events', 'Brand', 'Digital'];

// Flagship subset for the numbered Services list — full 20-item breadth lives
// in the scroll marquee instead, so this stays scannable.
export const FLAGSHIP_SERVICES = [
  {
    n: '01',
    name: 'Industrial & Corporate',
    copy: 'Factory floors, plants and process films, plus conferences, launches and AGMs shot for people who were not in the room.',
  },
  {
    n: '02',
    name: 'Weddings & Pre-Wedding',
    copy: 'Full-day candid and cinematic coverage, and story-led location films — carried with the same craft as the corporate work.',
  },
  {
    n: '03',
    name: 'Live & Events',
    copy: 'Multi-cam live production, LED walls, DJ and sound — the crew and kit for a show that has to run once and run right.',
  },
  {
    n: '04',
    name: 'Product & Brand',
    copy: 'Tabletop and e-commerce hero stills, brand content systems, logo and identity work, campaigns and positioning.',
  },
  {
    n: '05',
    name: 'Documentary & Digital',
    copy: 'Long-form documentary, multi-cam podcast setups, reels built to travel, and fast, bespoke websites.',
  },
];

export const PROCESS = [
  { step: '01', title: 'Listen', copy: 'We start with the brief behind the brief — what the frame has to achieve.' },
  { step: '02', title: 'Design', copy: 'Treatment, shot list, moodboard, crew and kit locked before day one.' },
  { step: '03', title: 'Shoot', copy: 'Calm sets, tight schedules, cinema glass and a crew that reads the room.' },
  { step: '04', title: 'Deliver', copy: 'Grade, sound, cutdowns and formats for every screen you publish on.' },
];

export const ABOUT_COPY =
  "7th Creation is a creative studio for photography, film, live events and the brand work that surrounds them. We have shot factory floors, wedding mandaps and product on black with the same discipline — treatment first, then a calm set, then a grade that holds up on any screen. If the brief is real, we want it.";

export const HERO = {
  eyebrow: 'Media production · Branding · Web',
  headingLine1: 'We make the frame',
  headingLine2: 'worth keeping.',
  sub: '7th Creation is a creative studio for photography, film, live events and the brand work that surrounds them — from an industrial floor to a wedding mandap to a product on black.',
  ctaPrimary: 'See the work',
  ctaSecondary: '20 things we shoot',
};

export const CONTACT = {
  email: 'hello@7thcreation.in',
  location: '7thcreation.in · India',
};
