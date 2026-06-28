import { Icon } from '../../components/ui/Icon';
import { useAdminStore } from './admin-content-store';

export function PublishBar() {
  const { state, publish, reloadRemote, forceOverwrite } = useAdminStore();
  const { dirty, publishStatus, publishMsg, commitUrl, conflict } = state;
  const busy = publishStatus === 'publishing';

  return (
    <div className="flex items-center gap-3">
      {publishStatus === 'done' && !dirty && (
        <span className="text-xs font-semibold text-[#1f8a5b] flex items-center gap-1">
          <Icon name="check_circle" className="text-sm" /> {publishMsg}
          {commitUrl && <a href={commitUrl} target="_blank" rel="noopener" className="underline ml-1">commit</a>}
        </span>
      )}
      {publishStatus === 'error' && (
        <span className="text-xs font-semibold text-primary flex items-center gap-1 max-w-[280px] truncate" title={publishMsg}>
          <Icon name="error" className="text-sm" /> {publishMsg}
        </span>
      )}
      {conflict && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-amber-700 flex items-center gap-1"><Icon name="warning" className="text-sm" /> {publishMsg}</span>
          <button
            onClick={() => { if (window.confirm('Discard your unpublished changes and load the latest content from the site?')) reloadRemote(); }}
            className="px-2.5 py-1.5 rounded-lg bg-[#f4f2ee] font-bold"
          >Reload latest</button>
          <button onClick={forceOverwrite} className="px-2.5 py-1.5 rounded-lg bg-primary text-white font-bold">Overwrite</button>
        </div>
      )}

      {dirty && publishStatus !== 'conflict' && (
        <span className="text-xs font-semibold text-[#8a8377]">Unpublished changes</span>
      )}

      <button
        onClick={publish}
        disabled={busy || !dirty}
        className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-[13px] disabled:opacity-50"
      >
        <Icon name={busy ? 'progress_activity' : 'cloud_upload'} className={'text-[17px] ' + (busy ? 'animate-spin' : '')} />
        {busy ? 'Publishing…' : 'Publish'}
      </button>
    </div>
  );
}
