import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SiteContent } from '../pages/admin/useAdminContent';
import bundled from '../content/site-content.json';
import { supabase, SITE_CONTENT_ID } from './supabase';

// Bundled JSON = instant first paint and offline fallback if Supabase is unreachable.
const FALLBACK = bundled as unknown as SiteContent;

const Ctx = createContext<SiteContent>(FALLBACK);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(FALLBACK);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('data')
      .eq('id', SITE_CONTENT_ID)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.warn('[site-content] using bundled fallback:', error.message);
          return;
        }
        if (data?.data) setContent(data.data as SiteContent);
      });
    return () => { active = false; };
  }, []);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(Ctx);
}
