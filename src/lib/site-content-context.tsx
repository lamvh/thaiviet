import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SiteContent } from '../pages/admin/useAdminContent';
import { supabase, SITE_CONTENT_ID } from './supabase';
import { DEFAULT_CONTENT, withContentDefaults } from './content-defaults';

// Bundled JSON = instant first paint and offline fallback if Supabase is unreachable.
const FALLBACK = DEFAULT_CONTENT;

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
        // A malformed row that makes withContentDefaults throw must not strand the site
        // silently — log it and keep the bundled fallback already in state.
        try {
          if (data?.data) setContent(withContentDefaults(data.data));
        } catch (e) {
          console.error('[site-content] failed to apply remote content:', e);
        }
      });
    return () => { active = false; };
  }, []);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(Ctx);
}
