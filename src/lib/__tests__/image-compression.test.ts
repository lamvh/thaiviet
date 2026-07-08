import { describe, it, expect } from 'vitest';
import { shouldCompress, outputName, compressImage } from '../image-compression';

const fileOf = (type: string, name = 'x') => new File([new Uint8Array(4)], name, { type });

describe('shouldCompress', () => {
  it('compresses raster images', () => {
    expect(shouldCompress(fileOf('image/jpeg'))).toBe(true);
    expect(shouldCompress(fileOf('image/png'))).toBe(true);
    expect(shouldCompress(fileOf('image/webp'))).toBe(true);
  });

  it('skips animated GIF and vector SVG', () => {
    expect(shouldCompress(fileOf('image/gif'))).toBe(false);
    expect(shouldCompress(fileOf('image/svg+xml'))).toBe(false);
  });

  it('skips non-images', () => {
    expect(shouldCompress(fileOf('video/mp4'))).toBe(false);
    expect(shouldCompress(fileOf('application/pdf'))).toBe(false);
  });
});

describe('outputName', () => {
  it('swaps the extension to match the output mime', () => {
    expect(outputName('photo.png', 'image/webp')).toBe('photo.webp');
    expect(outputName('IMG_1234.JPG', 'image/webp')).toBe('IMG_1234.webp');
    expect(outputName('no-ext', 'image/webp')).toBe('no-ext.webp');
  });
});

describe('compressImage', () => {
  it('returns the original untouched for skipped types (no canvas needed)', async () => {
    const gif = fileOf('image/gif', 'anim.gif');
    expect(await compressImage(gif)).toBe(gif);
    const svg = fileOf('image/svg+xml', 'logo.svg');
    expect(await compressImage(svg)).toBe(svg);
  });
});
