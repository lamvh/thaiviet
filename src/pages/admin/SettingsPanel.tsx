import { useEffect, useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { supabase } from '../../lib/supabase';

export function SettingsPanel() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? ''));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange in AdminAuthGate swaps back to the login form.
  };

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 max-w-[680px]">
      <h3 className="font-headline text-base font-bold mb-1.5">Account</h3>
      <p className="text-[13px] text-[#8a8377] mb-5">
        Saving writes your changes to the database; the live site updates immediately.
      </p>

      <div className="flex items-center gap-2 text-sm mb-5">
        <span className="text-[#1f8a5b] font-semibold flex items-center gap-1"><Icon name="check_circle" className="text-base" /> Signed in</span>
        {email && <span className="text-[#8a8377]">as {email}</span>}
      </div>

      <button
        onClick={signOut}
        className="bg-[#f4f2ee] px-5 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-1.5"
      >
        <Icon name="logout" className="text-base" /> Sign out
      </button>
    </div>
  );
}
