// Real copy and structure. Scope: one niche — creative production
// (photography, film, live events) — per the founder's direction: no web
// development, no marketing-as-a-service. Services below mirror the six
// categories in the Selected Work gallery 1:1, so the site tells one
// consistent story instead of two overlapping taxonomies.

export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

// Mirrors WORK_CATEGORIES in data/workCategories.ts — same six disciplines,
// same order. Also feeds the service dropdown in EnquiryForm.
export const FLAGSHIP_SERVICES = [
  {
    n: '01',
    name: 'Commercial Films',
    copy: 'Industrial and brand films — factory floors, product launches, corporate stories — for businesses that need their work shown, not just described.',
  },
  {
    n: '02',
    name: 'Weddings',
    copy: 'Full-day candid and cinematic coverage, from the first ritual to the last dance, shot with the same discipline as our commercial work.',
  },
  {
    n: '03',
    name: 'Advertising',
    copy: 'Ad films and product photography built to sell on sight — a single hero still or a full campaign shoot, script to final grade.',
  },
  {
    n: '04',
    name: 'Events',
    copy: 'Conferences, launches, birthdays and small gatherings alike — multi-cam coverage, LED walls, DJ and sound, for a show that runs once and has to run right.',
  },
  {
    n: '05',
    name: 'Music Videos',
    copy: 'Performance and narrative videos for singles, albums and live sessions — built around the track, not fitted to a template.',
  },
  {
    n: '06',
    name: 'Portrait & Fashion',
    copy: 'Considered portraits and editorial fashion shoots — for actors, founders, models and anyone who needs to be seen clearly.',
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
  "7th Creation is a creative production studio based in India, shooting photography, film and live events for people who need the real thing done right. One week that means a factory floor for a corporate film, the next a wedding mandap or a model on a fashion set — treatment first, then a calm set, then a grade that holds up on any screen. Small shoot or full production, if the brief is real, we want it.";

export const HERO = {
  eyebrow: 'Photography · Film · Live Events',
  headingLine1: 'We make the frame',
  headingLine2: 'worth keeping.',
  sub: '7th Creation is a creative production studio in India — commercial films, weddings, advertising, events, music videos and portrait & fashion work, all shot with one standard of craft.',
  ctaPrimary: 'See the work',
  ctaSecondary: 'See what we shoot',
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
