import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import corporateImg from '@/assets/stock/corporate.jpg';
import liveImg from '@/assets/stock/live-event.jpg';
import portfolioImg from '@/assets/stock/portfolio.jpg';

export interface GalleryItem {
  id: string;
  videoMp4: string;
  videoWebm: string;
}

export interface WorkCategory {
  n: string;
  slug: string;
  name: string;
  blurb: string;
  img: string;
  items: GalleryItem[];
}

// Base clip per category lives at `assets/video/projects/<slug>.mp4|webm`;
// additional gallery clips live at `assets/video/gallery/<slug>/2.mp4`,
// `3.mp4`, etc. Globbing (rather than named imports) means the gallery
// grows as more licensed clips land in that folder without any code change.
const projectMp4 = import.meta.glob('/src/assets/video/projects/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const projectWebm = import.meta.glob('/src/assets/video/projects/*.webm', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const galleryMp4 = import.meta.glob('/src/assets/video/gallery/*/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const galleryWebm = import.meta.glob('/src/assets/video/gallery/*/*.webm', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function numberFromPath(path: string): number {
  const match = path.match(/(\d+)\.mp4$/);
  return match ? parseInt(match[1], 10) : 0;
}

function itemsFor(slug: string): GalleryItem[] {
  const items: GalleryItem[] = [];

  const baseMp4 = projectMp4[`/src/assets/video/projects/${slug}.mp4`];
  const baseWebm = projectWebm[`/src/assets/video/projects/${slug}.webm`];
  if (baseMp4 && baseWebm) items.push({ id: `${slug}-1`, videoMp4: baseMp4, videoWebm: baseWebm });

  const extraKeys = Object.keys(galleryMp4)
    .filter((k) => k.startsWith(`/src/assets/video/gallery/${slug}/`))
    .sort((a, b) => numberFromPath(a) - numberFromPath(b));

  for (const key of extraKeys) {
    const webmKey = key.replace(/\.mp4$/, '.webm');
    const mp4 = galleryMp4[key];
    const webm = galleryWebm[webmKey];
    if (mp4 && webm) items.push({ id: key, videoMp4: mp4, videoWebm: webm });
  }

  return items;
}

const CATEGORY_META = [
  {
    n: '01',
    slug: 'commercial',
    name: 'Commercial Films',
    blurb: 'Brand and industrial films built for the frame, from factory floor to finished cut.',
    img: industrialImg,
  },
  {
    n: '02',
    slug: 'weddings',
    name: 'Weddings',
    blurb: 'Two families, one day — covered the way it actually happened, not staged for it.',
    img: weddingImg,
  },
  {
    n: '03',
    slug: 'advertising',
    name: 'Advertising',
    blurb: 'Product-first visuals for campaigns that need to sell on sight.',
    img: productImg,
  },
  {
    n: '04',
    slug: 'events',
    name: 'Events',
    blurb: 'Conferences, launches and gatherings, documented live as they unfold.',
    img: corporateImg,
  },
  {
    n: '05',
    slug: 'musicvideos',
    name: 'Music Videos',
    blurb: 'Performance and narrative videos built around the track, not around a template.',
    img: liveImg,
  },
  {
    n: '06',
    slug: 'portrait',
    name: 'Portrait Photography',
    blurb: 'Considered, unhurried portraits — in studio or wherever the light is right.',
    img: portfolioImg,
  },
] as const;

export const WORK_CATEGORIES: WorkCategory[] = CATEGORY_META.map((c) => ({
  ...c,
  items: itemsFor(c.slug),
}));
