import { Icon } from '../../../components/ui/Icon';
import type { Contact } from '../../../lib/types';

interface Props {
  contact: Contact;
  onChange?: (key: keyof Contact, value: string) => void;
  onSave?: () => void;
}

const fields: { key: keyof Contact; label: string; icon: string }[] = [
  { key: 'phone', label: 'Phone', icon: 'call' },
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'facebook', label: 'Facebook', icon: 'share' },
  { key: 'messenger', label: 'Messenger', icon: 'chat' },
  { key: 'hours', label: 'Business hours (Mon–Fri)', icon: 'schedule' },
];

export function ContactEditor({ contact, onChange, onSave }: Props) {
  const ro = !onChange;
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 max-w-[640px]">
      <h3 className="font-headline text-base font-bold mb-4">Contact &amp; Social</h3>
      <div className="flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">{f.label}</label>
            <div className="flex items-center gap-2.5 bg-[#faf8f4] border border-[#e6e1d8] rounded-lg px-3 focus-within:border-primary">
              <Icon name={f.icon} className="text-primary text-[19px]" />
              <input
                value={contact[f.key]}
                disabled={ro}
                onChange={onChange ? (e) => onChange(f.key, e.target.value) : undefined}
                className="flex-1 bg-transparent py-3 text-sm text-on-surface focus:outline-none disabled:opacity-70"
              />
            </div>
          </div>
        ))}
        <div>
          <button onClick={onSave} disabled={!onSave} className="bg-primary text-white px-5 py-3 rounded-lg font-bold text-sm disabled:opacity-50">Save changes</button>
        </div>
      </div>
    </div>
  );
}
