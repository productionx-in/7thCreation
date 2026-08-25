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

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string | null;
  event_date: string | null;
  location: string | null;
  budget_range: string | null;
  details: string | null;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quotation {
  id: string;
  quotation_number: string;
  lead_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  project_title: string;
  issue_date: string;
  valid_until: string | null;
  notes: string;
  terms: string;
  include_tax: boolean;
  tax_label: string;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

// The admin logs in with a fixed username (not email, not phone); internally
// that maps to Supabase email/password auth via a pseudo-email format
// that's never shown in the UI. Trimmed and lowercased so "7thAdmin",
// " 7thadmin ", and "7THADMIN" all resolve to the same account.
export function usernameToAuthEmail(username: string): string {
  const normalized = username.trim().toLowerCase();
  return `${normalized}@admin.7thcreation.internal`;
}
