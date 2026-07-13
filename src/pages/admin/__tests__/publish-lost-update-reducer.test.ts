import { describe, it, expect, vi } from 'vitest';

// Pure-reducer test — stub the Supabase client the store imports at load.
vi.mock('../../../lib/supabase', () => ({ supabase: {}, SITE_CONTENT_ID: 1 }));

import { reducer, initState } from '../admin-content-store';

describe('MARK_PUBLISHED does not clobber edits made while a save was in flight', () => {
  it('keeps a concurrent edit and stays dirty when it differs from the saved snapshot', () => {
    const start = initState();
    // Snapshot of what publish() sent to the DB (taken before the edit).
    const savedSnapshot = start.content;

    // User edits the phone while the save is awaiting the network round-trip.
    const edited = reducer(start, { t: 'UPDATE_CONTACT', key: 'phone', val: '027-NEW' });
    expect(edited.dirty).toBe(true);

    // The awaited save resolves and marks published with the OLD snapshot.
    const after = reducer(edited, { t: 'MARK_PUBLISHED', content: savedSnapshot, updatedAt: '2026-07-12T00:00:00Z' });

    // The in-flight edit must survive, and dirty must remain true (baseline advanced,
    // but content still has the unsaved edit).
    expect(after.content.contact.phone).toBe('027-NEW');
    expect(after.dirty).toBe(true);
    expect(after.remoteUpdatedAt).toBe('2026-07-12T00:00:00Z');
  });

  it('clears dirty when the saved snapshot matches the current content', () => {
    const edited = reducer(initState(), { t: 'UPDATE_CONTACT', key: 'phone', val: '027-NEW' });
    const after = reducer(edited, { t: 'MARK_PUBLISHED', content: edited.content, updatedAt: 't1' });
    expect(after.dirty).toBe(false);
    expect(after.content.contact.phone).toBe('027-NEW');
  });
});
