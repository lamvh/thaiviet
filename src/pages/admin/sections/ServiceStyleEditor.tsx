import { Icon } from '../../../components/ui/Icon';
import { useAdminStore } from '../admin-content-store';
import { SERVICE_STYLE_META } from '../../../components/services/service-skins';

// Global service-page layout selector. Applies the chosen style to every service detail
// page; the same per-service content is re-laid-out in the picked skin.
export function ServiceStyleEditor() {
  const store = useAdminStore();
  const current = store.state.content.serviceStyle;
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6">
      <h3 className="font-headline text-base font-bold">Service page layout</h3>
      <p className="text-xs text-[#8a8377] mt-1 mb-4">Choose the template used for all service detail pages. The same content is re-laid-out in the chosen style.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICE_STYLE_META.map((t) => {
          const selected = current === t.id;
          return (
            <button
              key={t.id}
              disabled={!t.ready}
              onClick={() => store.setServiceStyle(t.id)}
              className={'text-left p-4 rounded-xl border-2 transition-colors ' + (selected ? 'border-primary' : 'border-[#eae6df]') + (t.ready ? ' hover:border-primary' : ' opacity-50 cursor-not-allowed')}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Style {t.id} · {t.name}</span>
                {selected && <Icon name="check_circle" className="text-primary text-lg" />}
              </div>
              <p className="text-xs text-[#8a8377] mt-1">{t.desc}</p>
              {!t.ready && <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8377]">Coming soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
