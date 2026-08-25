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

// The admin logs in with a phone number; internally that maps to Supabase
// email/password auth (no SMS provider to configure, no cost) via a fixed
// pseudo-email format that's never shown in the UI. Normalized to the last
// 10 digits so it doesn't matter whether the +91 country code, spaces, or a
// leading 0 were typed — "9032180743" and "+91 90321 80743" resolve to the
// same account.
export function phoneToAuthEmail(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `${digits}@admin.7thcreation.internal`;
}
