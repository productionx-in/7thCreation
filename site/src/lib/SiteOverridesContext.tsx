import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { fetchSiteOverrides, type SiteOverrides, type MediaItemRow } from './siteOverrides';
import { HERO, ABOUT_COPY, FLAGSHIP_SERVICES, PROCESS, CONTACT } from '@/data/content';
import { MARQUEE_ROW_1, MARQUEE_ROW_2, type MockImage } from '@/data/images';
import { WORK_CATEGORIES, type WorkCategory, type GalleryItem } from '@/data/workCategories';

const SiteOverridesContext = createContext<SiteOverrides>({ content: {}, media: {} });

// Renders the built-in defaults instantly (zero network dependency, exactly
// today's behaviour), then swaps in whatever an admin has edited once the
// two background fetches resolve — usually well under a second, and never
// blocking first paint.
export function SiteOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<SiteOverrides>({ content: {}, media: {} });

  useEffect(() => {
    let cancelled = false;
    fetchSiteOverrides().then((o) => {
      if (!cancelled) setOverrides(o);
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
  url: string;
  poster: string;
}

export function useHeroVideo(): HeroVideoOverride | null {
  const { media } = useOverrides();
  const row = media.hero_bg?.[0];
  if (!row || row.kind !== 'video') return null;
  return { url: row.url, poster: row.poster_url ?? '' };
}

function toGalleryItems(rows: MediaItemRow[]): GalleryItem[] {
  return rows.map((r) =>
    r.kind === 'video'
      ? { id: r.id, type: 'video' as const, videoMp4: r.url, poster: r.poster_url ?? r.url }
      : { id: r.id, type: 'photo' as const, src: r.url },
  );
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
