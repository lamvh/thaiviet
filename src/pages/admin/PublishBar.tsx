import { Icon } from '../../components/ui/Icon';
import { useAdminStore } from './admin-content-store';

// Save status, not a save button — edits write themselves back (see the autosave effect
// in admin-content-store). Three states an editor cares about: a write is on its way,
// everything is on the row, or the last write was rejected and nothing is being saved
// until they change something.
export function PublishBar() {
  const { state } = useAdminStore();
  const { dirty, publishStatus, publishMsg } = state;

  if (publishStatus === 'error') {
    return (
      <span className="text-xs font-semibold text-primary flex items-center gap-1.5 max-w-[420px]" title={publishMsg}>
        <Icon name="error" className="text-sm shrink-0" />
        <span className="truncate">{publishMsg}</span>
        <span className="text-[#8a8377] font-normal shrink-0">— not saved</span>
      </span>
    );
  }

  // `dirty` covers both the debounce window and the request itself, so the indicator
  // reads "Saving…" from the first keystroke until the row actually has the change.
  if (dirty || publishStatus === 'publishing') {
    return (
      <span className="text-xs font-semibold text-[#8a8377] flex items-center gap-1.5">
        <Icon name="progress_activity" className="text-sm animate-spin" /> Saving…
      </span>
    );
  }

  if (publishStatus === 'done') {
    return (
      <span className="text-xs font-semibold text-[#1f8a5b] flex items-center gap-1.5">
        <Icon name="check_circle" className="text-sm" /> Saved — live now
      </span>
    );
  }

  return null;
}
