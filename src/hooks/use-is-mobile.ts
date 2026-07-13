import { useEffect, useState } from 'react';

// Phone-sized viewport, matching Tailwind's `md` breakpoint (< 768px). Used to render
// a tap-to-open facade for Facebook video embeds, whose iframe player is redirected to
// a player-less mobile page (black screen) on iOS.
const MOBILE_QUERY = '(max-width: 767px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
