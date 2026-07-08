import { supabase } from './supabase';
import { compressImage } from './image-compression';

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
// Validate a picked file against the requested kind and (for images) compress
// it, returning the exact bytes to send. Shared by uploadMedia + replaceMedia so
// both apply identical type/size guards and the same compression.
async function processForUpload(file: File, kind: MediaKind): Promise<{ blob: File; isVideo: boolean }> {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (kind === 'image' && !isImage) throw new Error('Please choose an image file.');
  if (kind === 'video' && !isVideo) throw new Error('Please choose a video file.');
  if (kind === 'media' && !isImage && !isVideo) throw new Error('Please choose an image or video file.');

  const blob = isImage ? await compressImage(file) : file;
  const maxMb = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
  if (blob.size > maxMb * 1024 * 1024) throw new Error(`File is too large (max ${maxMb}MB).`);
  return { blob, isVideo };
}

export async function uploadMedia(file: File, kind: MediaKind = 'media'): Promise<string> {
  const { blob, isVideo } = await processForUpload(file, kind);

  const ext = (blob.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')).toLowerCase();
  const base = slug(blob.name.replace(/\.[^.]+$/, '')) || 'file';
  const folder = isVideo ? 'videos' : 'images';
  const path = `${folder}/${base}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    cacheControl: '31536000', // the random path means the URL never needs busting
    upsert: false,
    contentType: blob.type,
  });
  if (error) throw new Error(error.message || 'Upload failed.');

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Media library (browse / delete / rename) — powers the admin Gallery section.
// ---------------------------------------------------------------------------

export interface MediaItem {
  path: string; // object key within the bucket, e.g. 'images/foo-uuid.webp'
  url: string; // public https URL (what content fields store)
  name: string; // file name shown in the grid
  size: number; // bytes
  updatedAt: string; // ISO timestamp, '' when the backend omits it
  kind: 'image' | 'video';
}

// The two folders uploadMedia writes into; nothing else lives in the bucket.
const MEDIA_FOLDERS: { folder: 'images' | 'videos'; kind: 'image' | 'video' }[] = [
  { folder: 'images', kind: 'image' },
  { folder: 'videos', kind: 'video' },
];

const publicUrl = (path: string) => supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;

async function listFolder(folder: 'images' | 'videos', kind: 'image' | 'video'): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(folder, { limit: 1000, sortBy: { column: 'updated_at', order: 'desc' } });
  if (error) throw new Error(error.message || 'Could not load media.');
  return (data ?? [])
    // Skip the zero-byte placeholder Supabase leaves in otherwise-empty folders.
    .filter((o) => o.name && o.name !== '.emptyFolderPlaceholder')
    .map((o) => {
      const path = `${folder}/${o.name}`;
      return {
        path,
        url: publicUrl(path),
        name: o.name,
        size: (o.metadata?.size as number) ?? 0,
        updatedAt: o.updated_at ?? o.created_at ?? '',
        kind,
      };
    });
}

/** Every uploaded object in the bucket, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  const groups = await Promise.all(MEDIA_FOLDERS.map(({ folder, kind }) => listFolder(folder, kind)));
  return groups.flat().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

/**
 * Permanently delete objects by path. Callers must warn first: a file that is
 * still referenced by a content field will 404 on the public site once removed.
 */
export async function deleteMedia(paths: string[]): Promise<void> {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) throw new Error(error.message || 'Delete failed.');
}

/**
 * Overwrite an existing object with a new file, keeping the SAME path — so every
 * page already referencing item.url keeps working with no re-pointing. Images are
 * compressed first; the new file must match the item's kind (image ↔ image).
 *
 * Caveat: the URL is unchanged, so a browser that already cached it may show the
 * old media until its cache expires (a hard refresh forces the new one).
 */
export async function replaceMedia(item: MediaItem, file: File): Promise<MediaItem> {
  const { blob } = await processForUpload(file, item.kind);
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(item.path, blob, {
    cacheControl: '31536000',
    upsert: true, // overwrite in place
    contentType: blob.type,
  });
  if (error) throw new Error(error.message || 'Replace failed.');
  return { ...item, size: blob.size };
}

/** Human-readable file size for the gallery cards. */
export function formatBytes(bytes: number): string {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const n = bytes / 1024 ** i;
  return `${n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}
