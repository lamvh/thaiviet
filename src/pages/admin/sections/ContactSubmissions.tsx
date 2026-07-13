import { useEffect, useState } from 'react';
import { Icon } from '../../../components/ui/Icon';
import { supabase } from '../../../lib/supabase';

// Read-only list of contact-form leads. Rows are inserted by the public form and are
// only readable by an authenticated admin (row-level security). This is a viewer, not
// an editor — it never mutates the table.
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  address: string | null;
  message: string;
  created_at: string;
}

export function ContactSubmissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    supabase
      .from('contact_submissions')
      .select('id, name, email, phone, service, address, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows((data as Submission[]) ?? []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <p className="text-[13px] text-[#8a8377] flex-1">
          {loading ? 'Loading…' : `${rows.length} submission${rows.length === 1 ? '' : 's'}`}
        </p>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg border border-[#e6e1d8] hover:bg-white">
          <Icon name="refresh" className="text-[18px]" /> Refresh
        </button>
      </div>

      {error && <div className="bg-[#fdf2f0] border border-[#f3d5cf] text-primary text-sm font-semibold rounded-xl p-4">{error}</div>}

      {!loading && !error && rows.length === 0 && (
        <div className="bg-white border border-dashed border-[#e0dbd2] rounded-2xl p-12 text-center text-[#8a8377]">
          <Icon name="inbox" className="text-4xl mb-2 opacity-60" />
          <p className="text-sm font-semibold">No submissions yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.id} className="bg-white border border-[#eae6df] rounded-2xl p-4">
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <span className="font-bold text-on-surface">{r.name}</span>
              <a href={'mailto:' + r.email} className="text-sm text-primary font-semibold">{r.email}</a>
              {r.phone && <a href={'tel:' + r.phone} className="text-sm text-on-surface-variant">{r.phone}</a>}
              <span className="text-[11px] text-[#8a8377] ml-auto">{new Date(r.created_at).toLocaleString()}</span>
            </div>
            {(r.service || r.address) && (
              <p className="text-[13px] text-on-surface-variant mb-1.5">
                {[r.service, r.address].filter(Boolean).join(' · ')}
              </p>
            )}
            <p className="text-sm text-on-surface whitespace-pre-wrap">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
