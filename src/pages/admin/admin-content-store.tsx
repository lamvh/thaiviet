import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import type { Hero, Contact, Project, Post, Homepage, Home, ServiceDetail, ProjectCategory, ServiceStyleId } from '../../lib/types';
import type { ProjectMeta, ProjectTemplateId, TemplateValue } from '../../lib/types';
import { projectTemplates } from '../../lib/templates/project-templates';
import { seedValues } from '../../lib/templates/seed';
import type { SiteContent } from './useAdminContent';
import { supabase, SITE_CONTENT_ID } from '../../lib/supabase';
import { validateContent } from '../../lib/content-schema';
import { DEFAULT_CONTENT, withContentDefaults } from '../../lib/content-defaults';
import { PROJECT_FILTERS } from '../../data/projects';

export type PublishStatus = 'idle' | 'publishing' | 'done' | 'error';

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
  compose: { step: 'pick' | 'build'; templateId: ProjectTemplateId | null; meta: ProjectMeta | null; values: Record<string, TemplateValue> | null; category: ProjectCategory; editingId: string | null };
}

type Action =
  | { t: 'TOGGLE'; kind: ItemKind; id: string }
  | { t: 'OPEN_EDIT'; kind: ItemKind; id: string }
  | { t: 'UPDATE_DRAFT'; key: string; val: string }
  | { t: 'SAVE_EDIT' }
  | { t: 'CLOSE_EDIT' }
  | { t: 'ADD_ITEM'; kind: ItemKind; id: string }
  | { t: 'UPDATE_HERO'; key: keyof Hero; val: string }
  | { t: 'UPDATE_HOME'; home: Home }
  | { t: 'UPDATE_SERVICE_DETAILS'; serviceDetails: ServiceDetail[] }
  | { t: 'SET_SERVICE_STYLE'; id: ServiceStyleId }
  | { t: 'UPDATE_HOMEPAGE'; homepage: Homepage }
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
  | { t: 'HYDRATE'; remote: SiteContent }
  | { t: 'COMPOSE_START' }
  | { t: 'COMPOSE_PICK'; id: ProjectTemplateId }
  | { t: 'COMPOSE_BACK' }
  | { t: 'COMPOSE_META'; key: keyof ProjectMeta; val: string }
  | { t: 'COMPOSE_VALUE'; key: string; val: TemplateValue }
  | { t: 'COMPOSE_CATEGORY'; cat: ProjectCategory }
  | { t: 'COMPOSE_EDIT'; id: string }
  | { t: 'COMPOSE_PUBLISH'; id: string };

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80';

const CAT_OPTS = PROJECT_FILTERS.filter((f) => f.value !== 'all');
const catLabel = (v: string): string => CAT_OPTS.find((o) => o.value === v)?.label ?? v;

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

export function reducer(state: AdminState, a: Action): AdminState {
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
      return { ...state, content: { ...state.content, [kind]: list }, editing: null, dirty: true, toast: 'Applied — click Save to publish' };
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
    case 'UPDATE_HOME':
      return { ...state, content: { ...state.content, home: a.home }, dirty: true };
    case 'UPDATE_SERVICE_DETAILS':
      return { ...state, content: { ...state.content, serviceDetails: a.serviceDetails }, dirty: true };
    case 'SET_SERVICE_STYLE':
      return { ...state, content: { ...state.content, serviceStyle: a.id }, dirty: true, toast: 'Layout style updated — click Save to publish' };
    case 'UPDATE_HOMEPAGE':
      return { ...state, content: { ...state.content, homepage: a.homepage }, dirty: true };
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
    case 'COMPOSE_START':
      return { ...state, compose: { step: 'pick', templateId: null, meta: null, values: null, category: 'interior', editingId: null } };
    case 'COMPOSE_PICK': {
      const def = projectTemplates[a.id];
      return { ...state, compose: { step: 'build', templateId: a.id, meta: { ...def.defaultMeta }, values: seedValues(def.sections), category: def.categoryValue, editingId: null } };
    }
    case 'COMPOSE_BACK':
      return { ...state, compose: { step: 'pick', templateId: null, meta: null, values: null, category: 'interior', editingId: null } };
    case 'COMPOSE_META':
      return state.compose.meta ? { ...state, compose: { ...state.compose, meta: { ...state.compose.meta, [a.key]: a.val } } } : state;
    case 'COMPOSE_VALUE':
      return state.compose.values ? { ...state, compose: { ...state.compose, values: { ...state.compose.values, [a.key]: a.val } } } : state;
    case 'COMPOSE_CATEGORY':
      return { ...state, compose: { ...state.compose, category: a.cat, meta: state.compose.meta ? { ...state.compose.meta, category: catLabel(a.cat) } : state.compose.meta } };
    case 'COMPOSE_EDIT': {
      // Open the wizard on an existing templated project so its meta + body are editable in place.
      const proj = state.content.projects.find((p) => p.id === a.id);
      if (!proj?.page) return state;
      return { ...state, compose: { step: 'build', templateId: proj.page.templateId, meta: { ...proj.page.meta }, values: clone(proj.page.values), category: proj.category, editingId: proj.id } };
    }
    case 'COMPOSE_PUBLISH': {
      const c = state.compose;
      if (!c.templateId || !c.meta || !c.values) return state;
      const page = { templateId: c.templateId, meta: c.meta, values: c.values };
      // Card fields are derived from the template meta so the /projects card and the
      // detail page never drift apart.
      const fields = { category: c.category, categoryLabel: catLabel(c.category), title: c.meta.title, desc: c.meta.intro, image: c.meta.cover };
      const reset = { step: 'pick' as const, templateId: null, meta: null, values: null, category: 'interior' as ProjectCategory, editingId: null };
      if (c.editingId) {
        const id = c.editingId;
        const projects = state.content.projects.map((p) => (p.id === id ? { ...p, ...fields, page } : p));
        return { ...state, content: { ...state.content, projects }, dirty: true, compose: reset, toast: 'Project updated — click Save to publish' };
      }
      const proj: Project = { id: a.id, ...fields, visible: true, page };
      return { ...state, content: { ...state.content, projects: [proj, ...state.content.projects] }, dirty: true, compose: reset, toast: 'Project added — click Save to publish' };
    }
    default:
      return state;
  }
}

export function initState(): AdminState {
  // Bundled content is only the first paint; the live DB row replaces it via HYDRATE on mount.
  // The database is the single source of truth — no localStorage draft.
  const base = DEFAULT_CONTENT;
  return {
    content: clone(base), base: clone(base), dirty: false, editing: null, draft: {}, newArea: '', toast: '',
    publishStatus: 'idle', publishMsg: '', commitUrl: '',
    compose: { step: 'pick', templateId: null, meta: null, values: null, category: 'interior', editingId: null },
  };
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
  updateHome: (updater: (h: Home) => Home) => void;
  updateServiceDetails: (updater: (arr: ServiceDetail[]) => ServiceDetail[]) => void;
  setServiceStyle: (id: ServiceStyleId) => void;
  updateHomepage: (updater: (h: Homepage) => Homepage) => void;
  updateContact: (key: keyof Contact, val: string) => void;
  setNewArea: (val: string) => void;
  addArea: () => void;
  removeArea: (index: number) => void;
  toast: (msg: string) => void;
  markPublished: (content: SiteContent) => void;
  publish: () => Promise<void>;
  clearPublish: () => void;
  startCompose: () => void;
  pickTemplate: (id: ProjectTemplateId) => void;
  backToTemplates: () => void;
  updateComposeMeta: (key: keyof ProjectMeta, val: string) => void;
  updateComposeValue: (key: string, val: TemplateValue) => void;
  updateComposeCategory: (cat: ProjectCategory) => void;
  editComposed: (id: string) => void;
  publishComposed: () => void;
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

  // One-time cleanup: drop any draft left behind by the old localStorage-backed version.
  useEffect(() => {
    try { localStorage.removeItem('tv-admin-content-draft'); } catch { /* ignore */ }
  }, []);

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
        dispatch({ t: 'HYDRATE', remote: withContentDefaults(data.data) });
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
    updateHome: (updater) => dispatch({ t: 'UPDATE_HOME', home: updater(state.content.home) }),
    updateServiceDetails: (updater) => dispatch({ t: 'UPDATE_SERVICE_DETAILS', serviceDetails: updater(state.content.serviceDetails) }),
    setServiceStyle: (id) => dispatch({ t: 'SET_SERVICE_STYLE', id }),
    updateHomepage: (updater) => dispatch({ t: 'UPDATE_HOMEPAGE', homepage: updater(state.content.homepage) }),
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
          .select('id');
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) throw new Error('Write blocked — no row updated (check Supabase RLS policy)');
        dispatch({ t: 'MARK_PUBLISHED', content: state.content });
        dispatch({ t: 'PUBLISH_DONE', commitUrl: '' });
        dispatch({ t: 'TOAST', msg: 'Saved to database ✓' });
      } catch (e) {
        dispatch({ t: 'PUBLISH_ERROR', msg: e instanceof Error ? e.message : 'Save failed' });
      }
    },
    startCompose: () => dispatch({ t: 'COMPOSE_START' }),
    pickTemplate: (id) => dispatch({ t: 'COMPOSE_PICK', id }),
    backToTemplates: () => dispatch({ t: 'COMPOSE_BACK' }),
    updateComposeMeta: (key, val) => dispatch({ t: 'COMPOSE_META', key, val }),
    updateComposeValue: (key, val) => dispatch({ t: 'COMPOSE_VALUE', key, val }),
    updateComposeCategory: (cat) => dispatch({ t: 'COMPOSE_CATEGORY', cat }),
    editComposed: (id) => dispatch({ t: 'COMPOSE_EDIT', id }),
    publishComposed: () => dispatch({ t: 'COMPOSE_PUBLISH', id: uniqueId('p', state.content.projects.map((x) => x.id)) }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAdminStore(): StoreApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminStore must be used within AdminContentProvider');
  return ctx;
}
