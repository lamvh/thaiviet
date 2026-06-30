import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!url || !key) {
  // Surface misconfig in dev; the public site still renders the bundled fallback.
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

// Single shared client for both public reads and authenticated admin writes.
export const supabase = createClient(url ?? '', key ?? '');

// The content table holds exactly one row; this is its fixed primary key.
export const SITE_CONTENT_ID = 1;
