import { Icon } from '../../components/ui/Icon';
import { useAdminStore } from './admin-content-store';

export function Toast() {
  const { state } = useAdminStore();
  if (!state.toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#1f8a5b] text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-[0_8px_28px_rgba(0,0,0,0.2)] flex items-center gap-2">
      <Icon name="check_circle" className="text-[19px]" />
      {state.toast}
    </div>
  );
}
