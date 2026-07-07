import { supabase } from './supabase';

// Supabase Storage bucket that holds all admin-uploaded media (images + videos).
// Create it once in the Supabase dashboard as a PUBLIC bucket named exactly this.
// Public URLs it returns are https://<project>.supabase.co/storage/v1/object/public/<bucket>/…
// which already satisfy the https:// content validation, so no schema change is needed.
// Override per environment (e.g. media-dev vs media-prod) via VITE_SUPABASE_MEDIA_BUCKET.
export const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'media';

// Client-side guards. These only fail fast for a better UX — the bucket's own
// file-size limit (set in the dashboard) is the real enforcement.
const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 100;

export type MediaKind = 'image' | 'video' | 'media';

// `accept` attribute for the file <input> matching a MediaKind.
export function acceptFor(kind: MediaKind): string {
  if (kind === 'image') return 'image/*';
  if (kind === 'video') return 'video/*';
  return 'image/*,video/*';
}

// Infer whether a form field holds an image/video from its label + key, so
// template-defined fields get an Upload button without an explicit `media` flag.
export function guessMediaKind(label: string, key = ''): MediaKind | undefined {
  const t = `${label} ${key}`.toLowerCase();
  if (/\bvideo\b|\bmp4\b|\bwebm\b/.test(t)) return 'video';
  if (/image|photo|cover|thumbnail|\bimg\b|\bbefore\b|\bafter\b|poster|avatar|logo|gallery/.test(t)) return 'image';
  return undefined;
}

// Strip anything that isn't filename-safe so the stored object key stays clean.
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

/**
 * Upload a user-picked File to Supabase Storage and return its public URL.
 * Validates type + size against the requested kind, then writes to a
 * collision-proof path (`images/…` or `videos/…`) with a random suffix.
 */
export async function uploadMedia(file: File, kind: MediaKind = 'media'): Promise<string> {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (kind === 'image' && !isImage) throw new Error('Please choose an image file.');
  if (kind === 'video' && !isVideo) throw new Error('Please choose a video file.');
  if (kind === 'media' && !isImage && !isVideo) throw new Error('Please choose an image or video file.');

  const maxMb = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
  if (file.size > maxMb * 1024 * 1024) throw new Error(`File is too large (max ${maxMb}MB).`);

  const ext = (file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')).toLowerCase();
  const base = slug(file.name.replace(/\.[^.]+$/, '')) || 'file';
  const folder = isVideo ? 'videos' : 'images';
  const path = `${folder}/${base}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000', // immutable — the random path means the URL never needs busting
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message || 'Upload failed.');

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
