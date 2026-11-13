import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, SITE_CONTENT_ID } from '../../lib/supabase';
import { MEDIA_BUCKET } from '../../lib/storage';

// Live health of the Supabase services the CMS depends on (DB row + media bucket).
//   checking  — first probe in flight
//   connected — probe answered quickly
//   slow      — probe answered, but slower than SLOW_MS (saves/uploads will lag)
//   offline   — the browser itself reports no network
//   error     — Supabase answered with an error or the request failed/timed out
export type DbStatus = 'checking' | 'connected' | 'slow' | 'offline' | 'error';

export interface DbConnectionState {
  status: DbStatus;
  latencyMs: number | null;
  checkedAt: Date | null;
  message: string;
  recheck: () => void;
}

type ProbeResult = { ok: true; ms: number } | { ok: false; message: string };
type Probe = () => Promise<{ error: { message: string } | null }>;

const POLL_MS = 30_000;
const SLOW_MS = 1_500;
const TIMEOUT_MS = 8_000;
const OFFLINE_MSG = 'Your device is offline — changes cannot be saved.';

// Times a probe and races it against a timeout, normalising every failure to a message.
async function timed(run: Probe): Promise<ProbeResult> {
  const start = performance.now();
  const timeout = new Promise<{ error: { message: string } }>((resolve) =>
    setTimeout(() => resolve({ error: { message: `No response after ${TIMEOUT_MS / 1000}s` } }), TIMEOUT_MS),
  );
  try {
    const { error } = await Promise.race([run(), timeout]);
    if (error) return { ok: false, message: error.message };
    return { ok: true, ms: Math.round(performance.now() - start) };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Request failed' };
  }
}

// DB probe = the cheapest real read on the table autosave writes to, so "connected"
// means the content row is reachable (URL, key, RLS and network all OK).
export const probeDatabase: Probe = async () =>
  supabase.from('site_content').select('id').eq('id', SITE_CONTENT_ID).limit(1);

// Storage probe = list one object in the media bucket. Fails with "Bucket not found"
// when the bucket is missing/misnamed, or a policy error when public read is off.
export const probeMediaBucket: Probe = async () =>
  supabase.storage.from(MEDIA_BUCKET).list('', { limit: 1 });

// Polls `run` on mount, every 30 s while the tab is visible, on tab focus and when
// the browser comes back online. `recheck` forces an immediate probe.
export function useConnectionStatus(run: Probe): DbConnectionState {
  const [status, setStatus] = useState<DbStatus>('checking');
  const [latencyMs, setLatency] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [message, setMessage] = useState('');
  const inFlight = useRef(false);

  const recheck = useCallback(async () => {
    if (inFlight.current) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setStatus('offline');
      setMessage(OFFLINE_MSG);
      setCheckedAt(new Date());
      return;
    }
    inFlight.current = true;
    const res = await timed(run);
    inFlight.current = false;
    setCheckedAt(new Date());
    if (res.ok) {
      setLatency(res.ms);
      setStatus(res.ms > SLOW_MS ? 'slow' : 'connected');
      setMessage('');
    } else {
      setLatency(null);
      setStatus('error');
      setMessage(res.message);
    }
  }, [run]);

  useEffect(() => {
    void recheck();
    const id = window.setInterval(() => {
      // Skip background tabs; the visibility listener re-probes when the editor comes back.
      if (document.visibilityState === 'visible') void recheck();
    }, POLL_MS);
    const onOnline = () => void recheck();
    const onOffline = () => { setStatus('offline'); setMessage(OFFLINE_MSG); setCheckedAt(new Date()); };
    const onVisible = () => { if (document.visibilityState === 'visible') void recheck(); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [recheck]);

  return { status, latencyMs, checkedAt, message, recheck };
}
