// Real copy and structure, carried over from the published Lovable build
// (seventh-creation-studio.lovable.app) — see brand/resolution-2026-08-24.md
// for how this was confirmed as the actual business. Scope narrowed to one
// niche — creative production (photography, film, live events) — per the
// founder's direction: no web development, no marketing-as-a-service.

export type Category = 'Photo & Film' | 'Events' | 'Brand' | 'Content';

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
  { name: 'Documentary', category: 'Photo & Film', note: 'Long-form, real people' },
  { name: 'Product Shoots', category: 'Photo & Film', note: 'Tabletop, e-comm, hero stills' },
  { name: 'Baby Shoots', category: 'Photo & Film', note: 'Newborn & milestone sessions' },
  { name: 'Portfolio Shoots', category: 'Photo & Film', note: 'Actors, models, founders' },
  { name: 'Birthday Parties', category: 'Events', note: 'Candid coverage & highlights' },
  { name: 'Corporate Events', category: 'Events', note: 'Conferences, launches, AGMs' },
  { name: 'Live Coverage', category: 'Events', note: 'Multi-cam live production' },
  { name: 'LED Walls', category: 'Events', note: 'Screens, feeds & content' },
  { name: 'DJ & Sound', category: 'Events', note: 'Artist, rig and show flow' },
  { name: 'Brand Content', category: 'Brand', note: 'Always-on visual content' },
  { name: 'Logo & Identity', category: 'Brand', note: 'Marks, systems, guidelines' },
  { name: 'Reels', category: 'Content', note: 'Short-form built to travel' },
  { name: 'Podcast Videos', category: 'Content', note: 'Multi-cam studio setups' },
];

export const CATEGORIES: Category[] = ['Photo & Film', 'Events', 'Brand', 'Content'];

// Flagship subset for the numbered Services list — full breadth lives in the
// scroll marquee instead, so this stays scannable.
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
    copy: 'Tabletop and e-commerce hero stills, always-on brand content, logo and identity work — visual craft, not a strategy deck.',
  },
  {
    n: '05',
    name: 'Documentary & Content',
    copy: 'Long-form documentary, multi-cam podcast setups, and reels built to travel — the same discipline at every length.',
  },
];

export const PROCESS = [
  { step: '01', title: 'Listen', copy: 'We start with the brief behind the brief — what the frame has to achieve.' },
  { step: '02', title: 'Design', copy: 'Treatment, shot list, moodboard, crew and kit locked before day one.' },
  { step: '03', title: 'Shoot', copy: 'Calm sets, tight schedules, cinema glass and a crew that reads the room.' },
  { step: '04', title: 'Deliver', copy: 'Grade, sound, cutdowns and formats for every screen you publish on.' },
];

// One clear, factual definition sentence up front — what the studio is, what
// it does, who it's for — before the texture. Answer engines and search
// crawlers both read this as the canonical description of the business.
export const ABOUT_COPY =
  "7th Creation is a creative production studio based in India, shooting photography, film and live events for people who need the real thing done right. We have shot factory floors, wedding mandaps and product on black with the same discipline — treatment first, then a calm set, then a grade that holds up on any screen. If the brief is real, we want it.";

export const HERO = {
  eyebrow: 'Photography · Film · Live Events',
  headingLine1: 'We make the frame',
  headingLine2: 'worth keeping.',
  sub: '7th Creation is a creative production studio in India — photography, film and live event coverage, from an industrial floor to a wedding mandap to a product on black.',
  ctaPrimary: 'See the work',
  ctaSecondary: '17 things we shoot',
};

export const CONTACT = {
  // ⚠️ Inherited from the Lovable build, unconfirmed — verify this inbox
  // exists before publishing. Everything below is founder-confirmed, real.
  email: 'hello@7thcreation.in',
  location: 'India',
  phone: '+91 90321 80743',
  phoneHref: 'tel:+919032180743',
  whatsappHref: 'https://wa.me/919032180743',
  instagram: 'https://www.instagram.com/7th_creation27/',
  youtube: 'https://www.youtube.com/@7thcreation524',
};
