import { Icon } from '../../components/ui/Icon';
import { useAdminStore } from './admin-content-store';

export function PublishBar() {
  const { state, publish } = useAdminStore();
  const { dirty, publishStatus, publishMsg } = state;
  const busy = publishStatus === 'publishing';

  return (
    <div className="flex items-center gap-3">
      {publishStatus === 'done' && !dirty && (
        <span className="text-xs font-semibold text-[#1f8a5b] flex items-center gap-1">
          <Icon name="check_circle" className="text-sm" /> {publishMsg}
        </span>
      )}
      {publishStatus === 'error' && (
        <span className="text-xs font-semibold text-primary flex items-center gap-1 max-w-[280px] truncate" title={publishMsg}>
          <Icon name="error" className="text-sm" /> {publishMsg}
        </span>
      )}
      {dirty && (
        <span className="text-xs font-semibold text-[#8a8377]">Unsaved changes</span>
      )}

      <button
        onClick={publish}
        disabled={busy || !dirty}
        className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-[13px] disabled:opacity-50"
      >
        <Icon name={busy ? 'progress_activity' : 'cloud_upload'} className={'text-[17px] ' + (busy ? 'animate-spin' : '')} />
        {busy ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
