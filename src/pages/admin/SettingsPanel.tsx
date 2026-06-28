import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { getPat, setPat, clearPat } from '../../lib/pat-store';
import { ACTIONS_URL } from '../../lib/github-api';
import { useAdminStore } from './admin-content-store';

export function SettingsPanel() {
  const { toast } = useAdminStore();
  const [value, setValue] = useState(getPat());
  const saved = getPat();

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 max-w-[680px]">
      <h3 className="font-headline text-base font-bold mb-1.5">Publishing Connection</h3>
      <p className="text-[13px] text-[#8a8377] mb-5">
        Publishing commits your changes to GitHub, which rebuilds the live site (~1 min). It needs a GitHub Personal
        Access Token stored only in this browser.
      </p>

      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a8377] mb-1.5">GitHub Personal Access Token</label>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={saved ? '•••••••• (saved)' : 'github_pat_…'}
        className="w-full box-border bg-[#faf8f4] border border-[#e6e1d8] rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
      />
      <div className="flex gap-2.5 mt-3">
        <button
          onClick={() => { setPat(value); toast('Token saved'); }}
          disabled={!value.trim()}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
        >Save token</button>
        <button
          onClick={() => { clearPat(); setValue(''); toast('Token cleared'); }}
          className="bg-[#f4f2ee] px-5 py-2.5 rounded-lg font-bold text-sm"
        >Clear</button>
        <span className={'self-center text-xs font-semibold ' + (saved ? 'text-[#1f8a5b]' : 'text-[#8a8377]')}>
          {saved ? '● Connected' : '○ Not connected'}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] text-amber-900 leading-relaxed">
        <strong className="flex items-center gap-1.5 mb-1"><Icon name="warning" className="text-base" /> Treat this token like a password</strong>
        It can change your repository and therefore what the live site deploys — not just content. Use a
        <strong> fine-grained PAT</strong> limited to the <strong>thaiviet</strong> repo with <strong>Contents: Read and write</strong> only
        (leave Workflows off), and a <strong>short expiry (≤7 days)</strong>. Anyone with this browser profile can read it, so
        clear it when you're done and regenerate periodically.
      </div>

      <a href={ACTIONS_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary">
        <Icon name="open_in_new" className="text-base" /> View deploy status on GitHub Actions
      </a>
    </div>
  );
}
