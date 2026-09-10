import industrialImg from '@/assets/stock/industrial.jpg';
import weddingImg from '@/assets/stock/wedding-candle.jpg';
import productImg from '@/assets/stock/product-podium.jpg';
import corporateImg from '@/assets/stock/corporate.jpg';
import liveImg from '@/assets/stock/live-event.jpg';
import portfolioImg from '@/assets/stock/portfolio.jpg';
import documentaryImg from '@/assets/stock/documentary.jpg';
import preWeddingImg from '@/assets/stock/prewedding.jpg';
import ledWallImg from '@/assets/stock/led-wall.jpg';
import birthdayImg from '@/assets/stock/birthday.jpg';
import podcastImg from '@/assets/stock/podcast.jpg';
import babyShootImg from '@/assets/stock/baby-shoot.jpg';

export interface VideoItem {
  id: string;
  type: 'video';
  // Exactly one of videoMp4 or youtubeId is set for an admin-managed item —
  // an uploaded file (in Storage) or a linked YouTube video (nothing stored
  // here at all, just the video ID). The built-in stock clips always use
  // videoMp4 (+ videoWebm, MP4-only for admin uploads — asking a
  // non-technical founder to also export WebM per clip isn't realistic).
  videoMp4?: string;
  videoWebm?: string;
  youtubeId?: string;
  poster: string;
}

export interface PhotoItem {
  id: string;
  type: 'photo';
  src: string;
}

export type GalleryItem = VideoItem | PhotoItem;

export interface WorkCategory {
  n: string;
  slug: string;
  name: string;
  blurb: string;
  img: string;
  items: GalleryItem[];
}

// Base clip per category lives at `assets/video/projects/<slug>.mp4|webm|jpg`
// (the `.jpg` is a generated poster frame, not hand-picked); additional
// gallery clips live at `assets/video/gallery/<slug>/2.mp4`, `3.mp4`, etc.,
// each with a matching poster. Globbing (rather than named imports) means
// the gallery grows as more licensed clips land in those folders without
// any code change — this is designed to hold hundreds of items per
// category once real client photos and films replace this placeholder set.
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
const projectPoster = import.meta.glob('/src/assets/video/projects/*.jpg', {
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
const galleryPoster = import.meta.glob('/src/assets/video/gallery/*/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function numberFromPath(path: string): number {
  const match = path.match(/(\d+)\.mp4$/);
  return match ? parseInt(match[1], 10) : 0;
}

function videoItemsFor(slug: string): VideoItem[] {
  const items: VideoItem[] = [];

  const baseMp4 = projectMp4[`/src/assets/video/projects/${slug}.mp4`];
  const baseWebm = projectWebm[`/src/assets/video/projects/${slug}.webm`];
  const basePoster = projectPoster[`/src/assets/video/projects/${slug}.jpg`];
  if (baseMp4 && baseWebm && basePoster) {
    items.push({ id: `${slug}-1`, type: 'video', videoMp4: baseMp4, videoWebm: baseWebm, poster: basePoster });
  }

  const extraKeys = Object.keys(galleryMp4)
    .filter((k) => k.startsWith(`/src/assets/video/gallery/${slug}/`))
    .sort((a, b) => numberFromPath(a) - numberFromPath(b));

  for (const key of extraKeys) {
    const webmKey = key.replace(/\.mp4$/, '.webm');
    const posterKey = key.replace(/\.mp4$/, '.jpg');
    const mp4 = galleryMp4[key];
    const webm = galleryWebm[webmKey];
    const poster = galleryPoster[posterKey];
    if (mp4 && webm && poster) items.push({ id: key, type: 'video', videoMp4: mp4, videoWebm: webm, poster });
  }

  return items;
}

function photo(id: string, src: string): PhotoItem {
  return { id, type: 'photo', src };
}

const CATEGORY_META = [
  {
    n: '01',
    slug: 'commercial',
    name: 'Commercial Films',
    blurb: 'Brand and industrial films built for the frame, from factory floor to finished cut.',
    img: industrialImg,
    photos: [photo('commercial-photo-1', industrialImg), photo('commercial-photo-2', documentaryImg)],
  },
  {
    n: '02',
    slug: 'weddings',
    name: 'Weddings',
    blurb: 'Two families, one day — covered the way it actually happened, not staged for it.',
    img: weddingImg,
    photos: [photo('weddings-photo-1', weddingImg), photo('weddings-photo-2', preWeddingImg)],
  },
  {
    n: '03',
    slug: 'advertising',
    name: 'Advertising',
    blurb: 'Product-first visuals for campaigns that need to sell on sight.',
    img: productImg,
    photos: [photo('advertising-photo-1', productImg), photo('advertising-photo-2', ledWallImg)],
  },
  {
    n: '04',
    slug: 'events',
    name: 'Events',
    blurb: 'Conferences, launches and gatherings — from a full corporate AGM to a small birthday — documented live as they unfold.',
    img: corporateImg,
    photos: [photo('events-photo-1', corporateImg), photo('events-photo-2', birthdayImg)],
  },
  {
    n: '05',
    slug: 'musicvideos',
    name: 'Music Videos',
    blurb: 'Performance and narrative videos built around the track, not around a template.',
    img: liveImg,
    photos: [photo('musicvideos-photo-1', liveImg), photo('musicvideos-photo-2', podcastImg)],
  },
  {
    n: '06',
    slug: 'portrait',
    name: 'Portrait & Fashion',
    blurb: 'Considered portraits and editorial fashion shoots — in studio or wherever the light is right.',
    img: portfolioImg,
    photos: [photo('portrait-photo-1', portfolioImg), photo('portrait-photo-2', babyShootImg)],
  },
] as const;

// Videos first, photos interleaved in after — keeps the grid from reading
// as "all video, then all photo" once real assets multiply the counts.
function interleave(videos: VideoItem[], photos: PhotoItem[]): GalleryItem[] {
  const items: GalleryItem[] = [];
  let vi = 0;
  let pi = 0;
  while (vi < videos.length || pi < photos.length) {
    if (vi < videos.length) items.push(videos[vi++]);
    if (vi < videos.length) items.push(videos[vi++]);
    if (pi < photos.length) items.push(photos[pi++]);
  }
  return items;
}

export const WORK_CATEGORIES: WorkCategory[] = CATEGORY_META.map(({ photos, ...c }) => ({
  ...c,
  items: interleave(videoItemsFor(c.slug), [...photos]),
}));
