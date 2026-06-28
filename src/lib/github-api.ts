import { toBase64, fromBase64 } from './base64';

// Repo target for content commits.
const OWNER = 'lamvh';
const REPO = 'thaiviet';
const BRANCH = 'main';
export const CONTENT_PATH = 'src/content/site-content.json';

const CONTENTS_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}`;
export const ACTIONS_URL = `https://github.com/${OWNER}/${REPO}/actions`;

function authHeaders(pat: string): HeadersInit {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return `${res.status}: ${data.message || res.statusText}`;
  } catch {
    return `${res.status}: ${res.statusText}`;
  }
}

export interface RemoteContent { sha: string; text: string; }

export async function getContentFile(pat: string): Promise<RemoteContent> {
  const res = await fetch(`${CONTENTS_URL}?ref=${BRANCH}`, { headers: authHeaders(pat) });
  if (!res.ok) throw new Error(await errorMessage(res));
  const data = await res.json();
  return { sha: data.sha, text: fromBase64(data.content) };
}

export interface PutResult { commitUrl: string; }

export async function putContentFile(pat: string, text: string, sha: string, message: string): Promise<PutResult> {
  const res = await fetch(CONTENTS_URL, {
    method: 'PUT',
    headers: authHeaders(pat),
    body: JSON.stringify({ message, content: toBase64(text), sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  const data = await res.json();
  return { commitUrl: data.commit?.html_url ?? '' };
}
