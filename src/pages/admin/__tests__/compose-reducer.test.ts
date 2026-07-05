import { describe, it, expect, vi } from 'vitest';

// The store module imports the Supabase client at load; stub it so this pure-reducer
// test runs in Node without env/config. Only reducer()/initState() are exercised — no
// provider, so no client method is ever called.
vi.mock('../../../lib/supabase', () => ({ supabase: {}, SITE_CONTENT_ID: 1 }));

import { reducer, initState } from '../admin-content-store';

describe('compose reducer', () => {
  it('COMPOSE_PICK seeds meta/values/category and clears editingId', () => {
    const s = reducer(initState(), { t: 'COMPOSE_PICK', id: 'casestudy' });
    expect(s.compose.step).toBe('build');
    expect(s.compose.templateId).toBe('casestudy');
    expect(s.compose.meta?.title).toBeTruthy();
    expect(s.compose.category).toBe('exterior'); // casestudy defaultMeta.category = "Exterior Painting"
    expect(s.compose.editingId).toBeNull();
  });

  it('COMPOSE_CATEGORY keeps the meta category label in sync with the enum', () => {
    let s = reducer(initState(), { t: 'COMPOSE_PICK', id: 'casestudy' });
    s = reducer(s, { t: 'COMPOSE_CATEGORY', cat: 'roof' });
    expect(s.compose.category).toBe('roof');
    expect(s.compose.meta?.category).toBe('Roof Painting');
  });

  it('COMPOSE_PUBLISH (new) prepends a project with a page and card fields derived from meta', () => {
    let s = reducer(initState(), { t: 'COMPOSE_PICK', id: 'casestudy' });
    s = reducer(s, { t: 'COMPOSE_PUBLISH', id: 'pX' });
    const p = s.content.projects[0];
    expect(p.id).toBe('pX');
    expect(p.page?.templateId).toBe('casestudy');
    expect(p.category).toBe('exterior');
    expect(p.categoryLabel).toBe('Exterior Painting');
    expect(p.title).toBe(p.page?.meta.title);
    expect(p.visible).toBe(true);
    expect(s.compose.editingId).toBeNull();
  });

  it('COMPOSE_EDIT then COMPOSE_PUBLISH updates in place, preserving id/visibility and not appending', () => {
    let s = reducer(initState(), { t: 'COMPOSE_PICK', id: 'beforeafter' });
    s = reducer(s, { t: 'COMPOSE_PUBLISH', id: 'pEdit' });
    const count = s.content.projects.length;

    s = reducer(s, { t: 'COMPOSE_EDIT', id: 'pEdit' });
    expect(s.compose.editingId).toBe('pEdit');
    s = reducer(s, { t: 'COMPOSE_META', key: 'title', val: 'Renamed' });
    s = reducer(s, { t: 'COMPOSE_PUBLISH', id: 'ignored' });

    expect(s.content.projects.length).toBe(count); // updated, not appended
    const after = s.content.projects.find((x) => x.id === 'pEdit');
    expect(after?.title).toBe('Renamed');           // card field follows meta
    expect(after?.page?.meta.title).toBe('Renamed'); // template body updated
    expect(after?.visible).toBe(true);               // visibility preserved
    expect(s.content.projects.some((x) => x.id === 'ignored')).toBe(false);
  });
});

describe('DELETE_ITEM', () => {
  it('removes a project by id and marks the content dirty', () => {
    let s = reducer(initState(), { t: 'COMPOSE_PICK', id: 'casestudy' });
    s = reducer(s, { t: 'COMPOSE_PUBLISH', id: 'pDel' });
    expect(s.content.projects.some((p) => p.id === 'pDel')).toBe(true);
    const after = reducer(s, { t: 'DELETE_ITEM', kind: 'projects', id: 'pDel' });
    expect(after.content.projects.some((p) => p.id === 'pDel')).toBe(false);
    expect(after.dirty).toBe(true);
  });

  it('closes the edit drawer if the deleted item was open', () => {
    const s = reducer(initState(), { t: 'ADD_ITEM', kind: 'projects', id: 'pOpen' });
    expect(s.editing?.id).toBe('pOpen');
    const after = reducer(s, { t: 'DELETE_ITEM', kind: 'projects', id: 'pOpen' });
    expect(after.editing).toBeNull();
  });
});
