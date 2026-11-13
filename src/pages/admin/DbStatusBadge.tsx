import { Icon } from '../../components/ui/Icon';
import { MEDIA_BUCKET } from '../../lib/storage';
import { useConnectionStatus, probeDatabase, probeMediaBucket, type DbStatus } from './use-db-connection-status';

// Header pills showing whether the CMS can reach the database and the media bucket.
// Click a pill to re-check now; hover for latency, last-checked time and any error.
const LOOK: Record<DbStatus, { suffix: string; dot: string; text: string; bg: string }> = {
  checking: { suffix: 'checking…', dot: 'bg-[#b9b2a6]', text: 'text-[#8a8377]', bg: 'bg-[#f4f2ee] border-[#e7e3dc]' },
  connected: { suffix: 'connected', dot: 'bg-[#1f8a5b]', text: 'text-[#1f8a5b]', bg: 'bg-[#eaf6f0] border-[#cfe9dc]' },
  slow: { suffix: 'slow', dot: 'bg-[#c98a0b]', text: 'text-[#9a6a06]', bg: 'bg-[#fdf5e4] border-[#f2dfb4]' },
  offline: { suffix: 'offline', dot: 'bg-primary', text: 'text-primary', bg: 'bg-[#fbeceb] border-[#f2cfcb]' },
  error: { suffix: 'unreachable', dot: 'bg-primary', text: 'text-primary', bg: 'bg-[#fbeceb] border-[#f2cfcb]' },
};

function StatusPill({ name, icon, detail, state }: { name: string; icon: string; detail: string; state: ReturnType<typeof useConnectionStatus> }) {
  const { status, latencyMs, checkedAt, message, recheck } = state;
  const look = LOOK[status];
  const healthy = status === 'connected' || status === 'slow';
  const label = `${name} ${look.suffix}`;

  const title = [
    `${label} (${detail})`,
    latencyMs != null ? `Response: ${latencyMs} ms` : '',
    message,
    checkedAt ? `Checked ${checkedAt.toLocaleTimeString()}` : '',
    'Click to check again',
  ].filter(Boolean).join('\n');

  return (
    <button
      type="button"
      onClick={recheck}
      title={title}
      aria-label={`${label}. Click to check again.`}
      aria-live="polite"
      className={'inline-flex items-center gap-2 border rounded-full px-3 py-1.5 text-xs font-bold transition-colors hover:brightness-95 ' + look.bg + ' ' + look.text}
    >
      <span className="relative flex w-2 h-2">
        {healthy && <span className={'absolute inset-0 rounded-full opacity-60 animate-ping motion-reduce:animate-none ' + look.dot} />}
        <span className={'relative w-2 h-2 rounded-full ' + look.dot} />
      </span>
      <Icon name={icon} className="text-[15px]" />
      {name}
      {latencyMs != null && healthy && <span className="font-semibold opacity-70 hidden sm:inline">{latencyMs} ms</span>}
      {status === 'checking' && <Icon name="progress_activity" className="text-sm animate-spin" />}
    </button>
  );
}

export function DbStatusBadge() {
  const db = useConnectionStatus(probeDatabase);
  const storage = useConnectionStatus(probeMediaBucket);
  return (
    <span className="inline-flex items-center gap-2">
      <StatusPill name="DB" icon="database" detail="site_content table" state={db} />
      <StatusPill name="Storage" icon="cloud" detail={`bucket "${MEDIA_BUCKET}"`} state={storage} />
    </span>
  );
}
