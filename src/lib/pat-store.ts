// GitHub Personal Access Token storage (separate key from the content autosave).
// SECURITY: localStorage is readable by any JS on this origin. Use a short-lived,
// fine-grained PAT scoped to this repo's contents only. Never log this value.
const PAT_KEY = 'tv-admin-github-pat';

export function getPat(): string {
  try { return localStorage.getItem(PAT_KEY) ?? ''; } catch { return ''; }
}

export function setPat(value: string): void {
  try { localStorage.setItem(PAT_KEY, value.trim()); } catch { /* private mode / quota */ }
}

export function clearPat(): void {
  try { localStorage.removeItem(PAT_KEY); } catch { /* ignore */ }
}
