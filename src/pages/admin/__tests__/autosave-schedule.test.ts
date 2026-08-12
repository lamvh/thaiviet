import { describe, it, expect, vi } from 'vitest';

// Pure-logic test — stub the Supabase client the store imports at load.
vi.mock('../../../lib/supabase', () => ({ supabase: {}, SITE_CONTENT_ID: 1 }));

import { reducer, initState, shouldScheduleAutosave, AUTOSAVE_DELAY_MS } from '../admin-content-store';

describe('autosave scheduling', () => {
  const edited = () => reducer(initState(), { t: 'UPDATE_CONTACT', key: 'phone', val: '027-NEW' });

  it('does not schedule a save when nothing is unsaved', () => {
    const clean = initState();
    expect(clean.dirty).toBe(false);
    expect(shouldScheduleAutosave(clean, null)).toBe(false);
  });

  it('schedules a save after an edit', () => {
    expect(shouldScheduleAutosave(edited(), null)).toBe(true);
  });

  it('does not stack a second write while one is in flight', () => {
    const inFlight = reducer(edited(), { t: 'PUBLISH_START' });
    expect(inFlight.publishStatus).toBe('publishing');
    expect(shouldScheduleAutosave(inFlight, null)).toBe(false);
  });

  it('stops retrying a rejected payload until something actually changes', () => {
    // A save is attempted and rejected (invalid field, or the row moved under us).
    const attempted = edited();
    const failed = reducer(attempted, { t: 'PUBLISH_ERROR', msg: 'Image URL must start with https://' });
    expect(failed.dirty).toBe(true);

    // Same content as the attempt that failed — resending it would fail identically,
    // so the timer must not re-arm. This is what keeps a bad payload off a retry loop.
    expect(shouldScheduleAutosave(failed, attempted.content)).toBe(false);

    // The editor fixes something: new content object, so autosave tries again.
    const fixed = reducer(failed, { t: 'UPDATE_CONTACT', key: 'phone', val: '027-FIXED' });
    expect(shouldScheduleAutosave(fixed, attempted.content)).toBe(true);
  });

  it('retries after an error that predates the current content', () => {
    // Error left over from an earlier attempt with different content — not a repeat.
    const failed = reducer(edited(), { t: 'PUBLISH_ERROR', msg: 'network down' });
    expect(shouldScheduleAutosave(failed, initState().content)).toBe(true);
  });

  it('debounces rather than writing on every keystroke', () => {
    expect(AUTOSAVE_DELAY_MS).toBeGreaterThanOrEqual(500);
  });
});
