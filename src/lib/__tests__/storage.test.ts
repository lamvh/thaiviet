import { describe, it, expect } from 'vitest';
import { guessMediaKind, acceptFor } from '../storage';

describe('guessMediaKind', () => {
  it('detects video from label or key', () => {
    expect(guessMediaKind('Video URL (mp4)')).toBe('video');
    expect(guessMediaKind('Clip', 'video')).toBe('video');
    expect(guessMediaKind('Background webm')).toBe('video');
  });

  it('detects image from common label/key wording', () => {
    expect(guessMediaKind('Hero image URL')).toBe('image');
    expect(guessMediaKind('Cover image URL')).toBe('image');
    expect(guessMediaKind('Before', 'before')).toBe('image');
    expect(guessMediaKind('After', 'after')).toBe('image');
    expect(guessMediaKind('Photo', 'img')).toBe('image');
    expect(guessMediaKind('Poster image URL')).toBe('image');
  });

  it('returns undefined for non-media fields', () => {
    expect(guessMediaKind('Title')).toBeUndefined();
    expect(guessMediaKind('Location', 'location')).toBeUndefined();
    expect(guessMediaKind('Year', 'year')).toBeUndefined();
  });
});

describe('acceptFor', () => {
  it('maps each kind to the right file input accept value', () => {
    expect(acceptFor('image')).toBe('image/*');
    expect(acceptFor('video')).toBe('video/*');
    expect(acceptFor('media')).toBe('image/*,video/*');
  });
});
