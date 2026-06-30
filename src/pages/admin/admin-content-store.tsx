import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import type { Hero, Contact, Project, Post } from '../../lib/types';
import rawContent from '../../content/site-content.json';
import type { SiteContent } from './useAdminContent';
import { supabase, SITE_CONTENT_ID } from '../../lib/supabase';
import { validateContent } from '../../lib/content-schema';

export type PublishStatus = 'idle' | 'publishing' | 'done' | 'error';

export const CONTENT_STORAGE_KEY = 'tv-admin-content-draft';

type ItemKind = 'projects' | 'posts';

interface EditState { kind: ItemKind; id: string; isNew?: boolean; }

interface AdminState {
  content: SiteContent;
  base: SiteContent; // snapshot loaded from repo bundle — Phase 4 conflict detection compares against this
  dirty: boolean;
  editing: EditState | null;
  draft: Record<string, string>;
  newArea: string;
  toast: string;
  publishStatus: PublishStatus;
  publishMsg: string;
  commitUrl: string;
}

type Action =
  | { t: 'TOGGLE'; kind: ItemKind; id: string }
  | { t: 'OPEN_EDIT'; kind: ItemKind; id: string }
  | { t: 'UPDATE_DRAFT'; key: string; val: string }
  | { t: 'SAVE_EDIT' }
  | { t: 'CLOSE_EDIT' }
  | { t: 'ADD_ITEM'; kind: ItemKind; id: string }
  | { t: 'UPDATE_HERO'; key: keyof Hero; val: string }
  | { t: 'UPDATE_CONTACT'; key: keyof Contact; val: string }
  | { t: 'SET_NEW_AREA'; val: string }
  | { t: 'ADD_AREA' }
  | { t: 'REMOVE_AREA'; index: number }
  | { t: 'TOAST'; msg: string }
  | { t: 'PUBLISH_START' }
  | { t: 'PUBLISH_DONE'; commitUrl: string }
  | { t: 'PUBLISH_ERROR'; msg: string }
  | { t: 'CLEAR_PUBLISH' }
  | { t: 'MARK_PUBLISHED'; content: SiteContent }
  | { t: 'HYDRATE'; remote: SiteContent };

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80';

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

function reducer(state: AdminState, a: Action): AdminState {
  switch (a.t) {
    case 'TOGGLE': {
      const list = state.content[a.kind].map((x) => (x.id === a.id ? { ...x, visible: x.visible === false } : x));
      return { ...state, content: { ...state.content, [a.kind]: list }, dirty: true, toast: 'Visibility updated' };
    }
    case 'OPEN_EDIT': {
      const item = (state.content[a.kind] as Array<Project | Post>).find((x) => x.id === a.id);
      return { ...state, editing: { kind: a.kind, id: a.id }, draft: item ? clone(item) as unknown as Record<string, string> : {} };
    }
    case 'UPDATE_DRAFT':
      return { ...state, draft: { ...state.draft, [a.key]: a.val } };
    case 'SAVE_EDIT': {
      if (!state.editing) return state;
      const { kind, id } = state.editing;
      const list = (state.content[kind] as Array<Project | Post>).map((x) => (x.id === id ? { ...x, ...state.draft } : x));
      return { ...state, content: { ...state.content, [kind]: list }, editing: null, dirty: true, toast: 'Changes saved' };
    }
    case 'CLOSE_EDIT': {
      // Discard a freshly-added item that was never saved.
      if (state.editing?.isNew) {
        const { kind, id } = state.editing;
        const list = (state.content[kind] as Array<Project | Post>).filter((x) => x.id !== id);
        return { ...state, content: { ...state.content, [kind]: list } as SiteContent, editing: null };
      }
      return { ...state, editing: null };
    }
    case 'ADD_ITEM': {
      const item =
        a.kind === 'projects'
          ? { id: a.id, category: 'interior', categoryLabel: 'Interior Painting', title: 'New Project', desc: '', image: PLACEHOLDER_IMG, visible: true }
          : { id: a.id, category: 'General', title: 'New Post', excerpt: '', image: PLACEHOLDER_IMG, date: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }), readTime: '3 min read', visible: true };
      const list = [item, ...(state.content[a.kind] as Array<Project | Post>)];
      return { ...state, content: { ...state.content, [a.kind]: list } as SiteContent, editing: { kind: a.kind, id: a.id, isNew: true }, draft: clone(item) as unknown as Record<string, string>, dirty: true };
    }
    case 'UPDATE_HERO':
      return { ...state, content: { ...state.content, hero: { ...state.content.hero, [a.key]: a.val } }, dirty: true };
    case 'UPDATE_CONTACT':
      return { ...state, content: { ...state.content, contact: { ...state.content.contact, [a.key]: a.val } }, dirty: true };
    case 'SET_NEW_AREA':
      return { ...state, newArea: a.val };
    case 'ADD_AREA': {
      const v = state.newArea.trim();
      if (!v) return state;
      return { ...state, content: { ...state.content, areas: [...state.content.areas, v] }, newArea: '', dirty: true, toast: 'Area added' };
    }
    case 'REMOVE_AREA':
      return { ...state, content: { ...state.content, areas: state.content.areas.filter((_, i) => i !== a.index) }, dirty: true };
    case 'TOAST':
      return { ...state, toast: a.msg };
    case 'PUBLISH_START':
      return { ...state, publishStatus: 'publishing', publishMsg: '', commitUrl: '' };
    case 'PUBLISH_DONE':
      return { ...state, publishStatus: 'done', publishMsg: 'Saved — live now', commitUrl: a.commitUrl };
    case 'PUBLISH_ERROR':
      return { ...state, publishStatus: 'error', publishMsg: a.msg };
    case 'CLEAR_PUBLISH':
      return { ...state, publishStatus: 'idle', publishMsg: '' };
    case 'MARK_PUBLISHED':
      return { ...state, base: clone(a.content), content: clone(a.content), dirty: false };
    case 'HYDRATE':
      // Refresh the published-state snapshot; adopt remote as the working copy only when there's no local draft.
      return state.dirty
        ? { ...state, base: clone(a.remote) }
        : { ...state, base: clone(a.remote), content: clone(a.remote) };
    default:
      return state;
  }
}

function initState(): AdminState {
  const base = rawContent as unknown as SiteContent;
  let content = clone(base);
  let dirty = false;
  try {
    const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { content: SiteContent; dirty: boolean };
      if (parsed?.content) { content = parsed.content; dirty = !!parsed.dirty; }
    }
  } catch { /* ignore corrupt draft */ }
  return { content, base: clone(base), dirty, editing: null, draft: {}, newArea: '', toast: '', publishStatus: 'idle', publishMsg: '', commitUrl: '' };
}

interface StoreApi {
  state: AdminState;
  toggle: (kind: ItemKind, id: string) => void;
  openEdit: (kind: ItemKind, id: string) => void;
  updateDraft: (key: string, val: string) => void;
  saveEdit: () => void;
  closeEdit: () => void;
  addItem: (kind: ItemKind) => void;
  updateHero: (key: keyof Hero, val: string) => void;
  updateContact: (key: keyof Contact, val: string) => void;
  setNewArea: (val: string) => void;
  addArea: () => void;
  removeArea: (index: number) => void;
  toast: (msg: string) => void;
  markPublished: (content: SiteContent) => void;
  publish: () => Promise<void>;
  clearPublish: () => void;
}

const Ctx = createContext<StoreApi | null>(null);

function uniqueId(prefix: string, existing: string[]): string {
  let n = existing.length + 1;
  let id = prefix + n;
  while (existing.includes(id)) { n += 1; id = prefix + n; }
  return id;
}

export function isHttpsUrl(v: string): boolean {
  return /^https:\/\//i.test(v.trim());
}

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave working copy + dirty flag to localStorage on every change.
  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify({ content: state.content, dirty: state.dirty }));
    } catch { /* quota / private mode — ignore */ }
  }, [state.content, state.dirty]);

  // Load the latest published content so dirty-tracking compares against Supabase.
  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('data')
      .eq('id', SITE_CONTENT_ID)
      .single()
      .then(({ data, error }) => {
        if (!active || error || !data?.data) return;
        dispatch({ t: 'HYDRATE', remote: data.data as SiteContent });
      });
    return () => { active = false; };
  }, []);

  // Warn before leaving with unsaved (unpublished) edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.dirty]);

  // Auto-dismiss toast.
  useEffect(() => {
    if (!state.toast) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => dispatch({ t: 'TOAST', msg: '' }), 2200);
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [state.toast]);

  const api: StoreApi = {
    state,
    toggle: (kind, id) => dispatch({ t: 'TOGGLE', kind, id }),
    openEdit: (kind, id) => dispatch({ t: 'OPEN_EDIT', kind, id }),
    updateDraft: (key, val) => dispatch({ t: 'UPDATE_DRAFT', key, val }),
    saveEdit: () => {
      // Validate image URL before committing the draft.
      const img = state.draft.image;
      if (img !== undefined && img !== '' && !isHttpsUrl(img)) { dispatch({ t: 'TOAST', msg: 'Image URL must start with https://' }); return; }
      dispatch({ t: 'SAVE_EDIT' });
    },
    closeEdit: () => dispatch({ t: 'CLOSE_EDIT' }),
    addItem: (kind) => dispatch({ t: 'ADD_ITEM', kind, id: uniqueId(kind === 'projects' ? 'p' : 'b', state.content[kind].map((x) => x.id)) }),
    updateHero: (key, val) => dispatch({ t: 'UPDATE_HERO', key, val }),
    updateContact: (key, val) => dispatch({ t: 'UPDATE_CONTACT', key, val }),
    setNewArea: (val) => dispatch({ t: 'SET_NEW_AREA', val }),
    addArea: () => dispatch({ t: 'ADD_AREA' }),
    removeArea: (index) => dispatch({ t: 'REMOVE_AREA', index }),
    toast: (msg) => dispatch({ t: 'TOAST', msg }),
    markPublished: (content) => dispatch({ t: 'MARK_PUBLISHED', content }),
    clearPublish: () => dispatch({ t: 'CLEAR_PUBLISH' }),
    publish: async () => {
      const errors = validateContent(state.content);
      if (errors.length) { dispatch({ t: 'TOAST', msg: errors[0] }); return; }
      dispatch({ t: 'PUBLISH_START' });
      try {
        // upsert (not update): creates row 1 if the seed never ran, instead of
        // silently affecting 0 rows. .select() returns the written row so we can
        // confirm the write actually landed rather than trusting a null error.
        const { data, error } = await supabase
          .from('site_content')
          .upsert({ id: SITE_CONTENT_ID, data: state.content, updated_at: new Date().toISOString() })
          .eq('id', SITE_CONTENT_ID)
          .select('id');
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) throw new Error('Write blocked — no row updated (check Supabase RLS policy)');
        dispatch({ t: 'MARK_PUBLISHED', content: state.content });
        dispatch({ t: 'PUBLISH_DONE', commitUrl: '' });
      } catch (e) {
        dispatch({ t: 'PUBLISH_ERROR', msg: e instanceof Error ? e.message : 'Save failed' });
      }
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAdminStore(): StoreApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore must be used within AdminContentProvider');
  return ctx;
}
