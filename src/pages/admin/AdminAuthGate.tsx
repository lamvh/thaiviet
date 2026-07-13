import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

// Real auth: the /admin gate now signs in through Supabase Auth (single admin
// account created in the Supabase dashboard). supabase-js persists the session
// and attaches its JWT to every request, so row-level-security policies can
// distinguish an authenticated admin from an anonymous visitor. There are no
// credentials in the client bundle.
export function AdminAuthGate({ children }: { children: ReactNode }) {
  // undefined = still resolving the initial session; null = signed out.
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f4f2ee] text-on-surface font-body p-4">
        <p className="text-sm text-[#8a8377]">Loading…</p>
      </div>
    );
  }

  if (!session) {
    const onSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setErr('');
      setBusy(true);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setBusy(false);
      if (error) setErr(error.message || 'Sign in failed.');
      // On success onAuthStateChange fires and swaps in the children.
    };
    return (
      <div className="min-h-screen grid place-items-center bg-[#f4f2ee] text-on-surface font-body p-4">
        <form onSubmit={onSubmit} className="bg-white border border-[#eae6df] rounded-2xl p-6 w-full max-w-[360px]">
          <h1 className="font-headline text-lg font-extrabold mb-1">Admin sign in</h1>
          <p className="text-[13px] text-[#8a8377] mb-5">Sign in with your admin account to edit site content.</p>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus autoComplete="username"
            className="w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm mb-3 focus:outline-none focus:border-primary" />
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
            className="w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm focus:outline-none focus:border-primary" />
          {err && <p className="text-xs font-semibold text-primary mt-3">{err}</p>}
          <button type="submit" disabled={busy}
            className="w-full mt-4 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm disabled:opacity-70">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
