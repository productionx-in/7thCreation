import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { fetchSiteOverrides, type SiteOverrides, type MediaItemRow } from './siteOverrides';
import { youtubeThumbnailUrl } from './youtube';
import { HERO, ABOUT_COPY, FLAGSHIP_SERVICES, PROCESS, CONTACT } from '@/data/content';
import { MARQUEE_ROW_1, MARQUEE_ROW_2, type MockImage } from '@/data/images';
import { WORK_CATEGORIES, type WorkCategory, type GalleryItem } from '@/data/workCategories';

const SiteOverridesContext = createContext<SiteOverrides>({ content: {}, media: {} });

const CACHE_KEY = '7tc_site_overrides_v1';

// A genuinely first-ever visit has no choice but to show the built-in
// defaults (hero video included) for the brief moment the fetch takes —
// there's nothing to show instead. But every visit after that has already
// seen the real overrides once, so cache them and read that back
// synchronously on mount: the correct hero video/content paints on frame
// one instead of flashing the stock default first and swapping a second
// later. Wrapped in try/catch since private browsing can throw on storage
// access.
function readCache(): SiteOverrides {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { content: {}, media: {} };
    return JSON.parse(raw) as SiteOverrides;
  } catch {
    return { content: {}, media: {} };
  }
}

function writeCache(overrides: SiteOverrides) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(overrides));
  } catch {
    // storage disabled/full/private — the page still works, just re-fetches every time
  }
}

export function SiteOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<SiteOverrides>(readCache);

  useEffect(() => {
    let cancelled = false;
    fetchSiteOverrides().then((o) => {
      if (cancelled) return;
      setOverrides(o);
      writeCache(o);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteOverridesContext.Provider value={overrides}>{children}</SiteOverridesContext.Provider>;
}

function useOverrides(): SiteOverrides {
  return useContext(SiteOverridesContext);
}

export function useHero(): typeof HERO {
  const { content } = useOverrides();
  const o = content.hero as Partial<typeof HERO> | undefined;
  return o ? { ...HERO, ...o } : HERO;
}

export function useAboutCopy(): string {
  const { content } = useOverrides();
  const o = content.about as { copy?: string } | undefined;
  return o?.copy?.trim() ? o.copy : ABOUT_COPY;
}

export function useServices(): typeof FLAGSHIP_SERVICES {
  const { content } = useOverrides();
  const o = content.services as typeof FLAGSHIP_SERVICES | undefined;
  return Array.isArray(o) && o.length > 0 ? o : FLAGSHIP_SERVICES;
}

export function useProcessSteps(): typeof PROCESS {
  const { content } = useOverrides();
  const o = content.process as typeof PROCESS | undefined;
  return Array.isArray(o) && o.length > 0 ? o : PROCESS;
}

export function useContactInfo(): typeof CONTACT {
  const { content } = useOverrides();
  const o = content.contact as Partial<typeof CONTACT> | undefined;
  return o ? { ...CONTACT, ...o } : CONTACT;
}

function toMarqueeTiles(rows: MediaItemRow[] | undefined, fallback: MockImage[]): MockImage[] {
  if (!rows || rows.length === 0) return fallback;
  return rows.map((r) => ({ label: r.label ?? '', icon: ImageIcon, photo: r.url, custom: true }));
}

export function useMarqueeRow1(): MockImage[] {
  const { media } = useOverrides();
  return toMarqueeTiles(media.marquee_row_1, MARQUEE_ROW_1);
}

export function useMarqueeRow2(): MockImage[] {
  const { media } = useOverrides();
  return toMarqueeTiles(media.marquee_row_2, MARQUEE_ROW_2);
}

export interface HeroVideoOverride {
  source: 'upload' | 'youtube';
  url: string;
  poster: string;
}

export function useHeroVideo(): HeroVideoOverride | null {
  const { media } = useOverrides();
  const row = media.hero_bg?.[0];
  if (!row || row.kind !== 'video') return null;
  return { source: row.source, url: row.url, poster: row.poster_url ?? '' };
}

function toGalleryItems(rows: MediaItemRow[]): GalleryItem[] {
  return rows.map((r) => {
    if (r.kind !== 'video') return { id: r.id, type: 'photo' as const, src: r.url };
    return r.source === 'youtube'
      ? { id: r.id, type: 'video' as const, youtubeId: r.url, poster: r.poster_url ?? youtubeThumbnailUrl(r.url) }
      : { id: r.id, type: 'video' as const, videoMp4: r.url, poster: r.poster_url ?? r.url };
  });
}

// Each work category can have its cover photo replaced independently of its
// gallery clips — an admin should be able to swap the card thumbnail without
// being forced to also re-upload the whole gallery in one sitting.
export function useWorkCategories(): (WorkCategory & { customCover: boolean })[] {
  const { media } = useOverrides();
  return WORK_CATEGORIES.map((cat) => {
    const cover = media[`work_${cat.slug}_cover`]?.[0];
    const gallery = media[`work_${cat.slug}_gallery`];
    return {
      ...cat,
      img: cover?.url ?? cat.img,
      customCover: Boolean(cover),
      items: gallery && gallery.length > 0 ? toGalleryItems(gallery) : cat.items,
    };
  });
}
