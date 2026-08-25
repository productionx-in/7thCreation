import { createClient } from '@supabase/supabase-js';

// The anon/publishable key is safe to ship in client code by design — it
// carries no privilege on its own. Every table it can touch is gated by the
// RLS policies in Supabase, not by keeping this key secret. Hardcoded
// (rather than an env var) because this is a static Vite build with no
// server step to inject one at deploy time.
const SUPABASE_URL = 'https://wdsnhciwuhkwkwuvxrru.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yqGOdTs4J5Vbz8_jMBTGBg_rcU2hykV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  content: string;
  tags: string[];
  author: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// The admin logs in with a fixed username (not email, not phone); internally
// that maps to Supabase email/password auth via a pseudo-email format
// that's never shown in the UI. Trimmed and lowercased so "7thAdmin",
// " 7thadmin ", and "7THADMIN" all resolve to the same account.
export function usernameToAuthEmail(username: string): string {
  const normalized = username.trim().toLowerCase();
  return `${normalized}@admin.7thcreation.internal`;
}
