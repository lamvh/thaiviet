import { useState, type ReactNode, type FormEvent } from 'react';

// TEMPORARY hardcoded login. Replace with Supabase Auth (signInWithPassword + session)
// before relying on this in production — see the Supabase-auth version in the plan doc.
const TEMP_USER = 'admin';
const TEMP_PASS = 'admin';
export const TEMP_AUTH_KEY = 'tv-admin-temp-auth';

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(TEMP_AUTH_KEY) === '1'; } catch { return false; }
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  if (!authed) {
    const onSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (username === TEMP_USER && password === TEMP_PASS) {
        try { sessionStorage.setItem(TEMP_AUTH_KEY, '1'); } catch { /* private mode — session-only */ }
        setAuthed(true);
      } else {
        setErr('Incorrect username or password.');
      }
    };
    return (
      <div className="min-h-screen grid place-items-center bg-[#f4f2ee] text-on-surface font-body p-4">
        <form onSubmit={onSubmit} className="bg-white border border-[#eae6df] rounded-2xl p-6 w-full max-w-[360px]">
          <h1 className="font-headline text-lg font-extrabold mb-1">Admin sign in</h1>
          <p className="text-[13px] text-[#8a8377] mb-5">Temporary access. Sign in to edit site content.</p>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus
            className="w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm mb-3 focus:outline-none focus:border-primary" />
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm focus:outline-none focus:border-primary" />
          {err && <p className="text-xs font-semibold text-primary mt-3">{err}</p>}
          <button type="submit"
            className="w-full mt-4 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
