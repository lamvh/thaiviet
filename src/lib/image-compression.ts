// Client-side image compression run right before upload, so Supabase Storage
// only ever holds a resized, re-encoded copy instead of a raw phone photo.
// Uses the browser Canvas API only — no dependency, keeps the bundle small.

export interface CompressOptions {
  maxDimension?: number; // longest edge in px; images are only ever scaled DOWN
  quality?: number; // 0..1 for the lossy re-encode
  mimeType?: string; // output type; WebP is smaller than JPEG and keeps alpha
}

const DEFAULTS = { maxDimension: 1920, quality: 0.82, mimeType: 'image/webp' } as const;

// Types we must NOT rasterize: animated GIF (canvas flattens to one frame) and
// SVG (vector — re-encoding to a bitmap bloats it and loses scalability).
const SKIP_TYPES = ['image/gif', 'image/svg+xml'];

// Only real, non-vector, non-animated raster images are worth compressing.
export function shouldCompress(file: File): boolean {
  return file.type.startsWith('image/') && !SKIP_TYPES.includes(file.type);
}

// Swap the extension to match the re-encoded mime (e.g. photo.png -> photo.webp),
// so the uploaded object key and its Content-Type stay consistent.
export function outputName(name: string, mimeType: string): string {
  const ext = mimeType.split('/')[1] || 'webp';
  return name.replace(/\.[^.]+$/, '') + '.' + ext;
}

/**
 * Return a shrunk copy of an image File, or the original untouched when
 * compression isn't applicable or wouldn't help. Never throws — any decode/
 * encode failure falls back to uploading the original file as-is.
 */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  if (!shouldCompress(file)) return file;
  const { maxDimension, quality, mimeType } = { ...DEFAULTS, ...opts };

  let bitmap: ImageBitmap;
  try {
    // `from-image` bakes EXIF orientation into the pixels so portrait phone
    // photos aren't uploaded sideways.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // browser can't decode this type — upload original
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, quality));

  // Encoding failed, or the result didn't actually shrink (already-optimized
  // small image) — keep whichever is smaller.
  if (!blob || blob.size >= file.size) return file;

  return new File([blob], outputName(file.name, mimeType), {
    type: mimeType,
    lastModified: file.lastModified,
  });
}
