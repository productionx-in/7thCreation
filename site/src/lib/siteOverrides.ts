// Raw PostgREST reads for admin-editable site content/media — deliberately
// not the full supabase-js client. This runs on every visit to every public
// page (landing + blog), so it follows the same discipline as
// lib/tracking.ts: a bare fetch(), not a ~220KB dependency, for something
// that only ever needs two anonymous GETs.
const SUPABASE_URL = 'https://wdsnhciwuhkwkwuvxrru.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yqGOdTs4J5Vbz8_jMBTGBg_rcU2hykV';

export interface MediaItemRow {
  id: string;
  section: string;
  kind: 'image' | 'video';
  label: string | null;
  url: string;
  poster_url: string | null;
  sort_order: number;
}

export interface SiteOverrides {
  content: Record<string, unknown>;
  media: Record<string, MediaItemRow[]>;
}

const EMPTY_OVERRIDES: SiteOverrides = { content: {}, media: {} };

// A row here means "an admin has edited this" — every consumer treats an
// absent key/section as "use the built-in default", so a Supabase outage or
// an empty table just means the site looks exactly as it does today.
export async function fetchSiteOverrides(): Promise<SiteOverrides> {
  try {
    const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
    const [contentRes, mediaRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/site_content?select=key,value`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/media_items?select=*&order=sort_order.asc`, { headers }),
    ]);
    if (!contentRes.ok || !mediaRes.ok) return EMPTY_OVERRIDES;

    const contentRows = (await contentRes.json()) as { key: string; value: unknown }[];
    const mediaRows = (await mediaRes.json()) as MediaItemRow[];

    const content: Record<string, unknown> = {};
    for (const row of contentRows) content[row.key] = row.value;

    const media: Record<string, MediaItemRow[]> = {};
    for (const row of mediaRows) {
      (media[row.section] ??= []).push(row);
    }

    return { content, media };
  } catch {
    return EMPTY_OVERRIDES;
  }
}
