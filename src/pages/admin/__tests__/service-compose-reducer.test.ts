import { describe, it, expect, vi } from 'vitest';

// The store module imports the Supabase client at load; stub it so this pure-reducer
// test runs in Node without env/config. Only reducer()/initState() are exercised.
vi.mock('../../../lib/supabase', () => ({ supabase: {}, SITE_CONTENT_ID: 1 }));

import { reducer, initState } from '../admin-content-store';

describe('service compose', () => {
  it('publishes a new service with derived card fields', () => {
    let s = initState();
    s = reducer(s, { t: 'SVC_COMPOSE_PICK', id: 'servicesidebar' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'slug', val: 'decks' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'name', val: 'Deck Staining' });
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'heroSub', val: 'Weatherproof decks' });
    s = reducer(s, { t: 'SVC_COMPOSE_PUBLISH' });
    const added = s.content.serviceDetails.find((x) => x.slug === 'decks')!;
    expect(added.name).toBe('Deck Staining');
    expect(added.desc).toBe('Weatherproof decks'); // = heroSub
    expect(added.page?.templateId).toBe('servicesidebar');
    expect(added.visible).toBe(true);
  });

  it('edits a service in place without appending, preserving slug', () => {
    let s = initState();
    const target = s.content.serviceDetails[0].slug;
    const count = s.content.serviceDetails.length;
    s = reducer(s, { t: 'SVC_COMPOSE_EDIT', slug: target });
    expect(s.serviceCompose.editingId).toBe(target);
    s = reducer(s, { t: 'SVC_COMPOSE_META', key: 'name', val: 'Renamed Service' });
    s = reducer(s, { t: 'SVC_COMPOSE_PUBLISH' });
    expect(s.content.serviceDetails.length).toBe(count); // updated, not appended
    const after = s.content.serviceDetails.find((x) => x.slug === target)!;
    expect(after.name).toBe('Renamed Service');
    expect(s.serviceCompose.editingId).toBeNull();
  });

  it('toggles and deletes a service by slug', () => {
    let s = initState();
    const slug = s.content.serviceDetails[0].slug;
    s = reducer(s, { t: 'TOGGLE_SERVICE', slug });
    expect(s.content.serviceDetails.find((x) => x.slug === slug)!.visible).toBe(false);
    s = reducer(s, { t: 'DELETE_SERVICE', slug });
    expect(s.content.serviceDetails.some((x) => x.slug === slug)).toBe(false);
    expect(s.dirty).toBe(true);
  });
});
