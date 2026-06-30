import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import type { AdminSection } from './useAdminContent';
import { AdminContentProvider, useAdminStore, isHttpsUrl } from './admin-content-store';
import { AdminAuthGate } from './AdminAuthGate';
import { AdminSidebar } from './AdminSidebar';
import { Overview } from './sections/Overview';
import { ProjectsTable } from './sections/ProjectsTable';
import { BlogTable } from './sections/BlogTable';
import { HeroEditor } from './sections/HeroEditor';
import { AreasEditor } from './sections/AreasEditor';
import { ContactEditor } from './sections/ContactEditor';
import { EditDrawer } from './EditDrawer';
import { Toast } from './Toast';
import { PublishBar } from './PublishBar';
import { SettingsPanel } from './SettingsPanel';

const META: Record<AdminSection, [string, string]> = {
  overview: ['Overview', 'A snapshot of your website content'],
  projects: ['Projects', 'Manage the project gallery shown on your site'],
  blog: ['Blog', 'Write and publish articles'],
  home: ['Homepage / Hero', 'Edit the headline visitors see first'],
  areas: ['Service Areas', 'Suburbs and towns you cover'],
  contact: ['Contact & Social', 'Phone, email and social links'],
  settings: ['Settings', 'Your account and sign out'],
};

const SITE_URL = import.meta.env.BASE_URL;

function AdminInner() {
  const [section, setSection] = useState<AdminSection>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const store = useAdminStore();
  const { content } = store.state;
  const [title, sub] = META[section];

  return (
    <div className="flex min-h-screen bg-[#f4f2ee] text-on-surface font-body">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar section={section} onSelect={setSection} content={content} />
      </div>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="md:hidden fixed inset-0 z-[70] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="relative">
            <AdminSidebar section={section} onSelect={(s) => { setSection(s); setMobileNav(false); }} content={content} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 sm:gap-5 px-4 sm:px-8 py-4 bg-white border-b border-[#e7e3dc] flex-wrap">
          <button className="md:hidden text-on-surface-variant" onClick={() => setMobileNav(true)} aria-label="Open menu">
            <Icon name="menu" className="text-2xl" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-lg sm:text-[22px] font-extrabold truncate">{title}</h1>
            <p className="text-[13px] text-[#8a8377] mt-0.5 truncate">{sub}</p>
          </div>
          <PublishBar />
          <a href={SITE_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 bg-white border border-[#e7e3dc] text-on-surface px-4 py-2.5 rounded-lg font-bold text-[13px]">
            <Icon name="open_in_new" className="text-[17px]" /> View site
          </a>
        </header>

        <div className="p-4 sm:p-8 flex-1 overflow-auto">
          {section === 'overview' && <Overview content={content} onNavigate={setSection} />}
          {section === 'projects' && (
            <ProjectsTable projects={content.projects} onToggle={(id) => store.toggle('projects', id)} onEdit={(id) => store.openEdit('projects', id)} onNew={() => store.addItem('projects')} />
          )}
          {section === 'blog' && (
            <BlogTable posts={content.posts} onToggle={(id) => store.toggle('posts', id)} onEdit={(id) => store.openEdit('posts', id)} onNew={() => store.addItem('posts')} />
          )}
          {section === 'home' && (
            <HeroEditor
              hero={content.hero}
              onChange={store.updateHero}
              onSave={() => store.toast(isHttpsUrl(content.hero.image) ? 'Homepage updated' : 'Image URL must start with https://')}
            />
          )}
          {section === 'areas' && (
            <AreasEditor areas={content.areas} newArea={store.state.newArea} onNewAreaChange={store.setNewArea} onAdd={store.addArea} onRemove={store.removeArea} />
          )}
          {section === 'contact' && (
            <ContactEditor contact={content.contact} onChange={store.updateContact} onSave={() => store.toast('Contact details saved')} />
          )}
          {section === 'settings' && <SettingsPanel />}
        </div>
      </div>

      <EditDrawer />
      <Toast />
    </div>
  );
}

export function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminContentProvider>
        <AdminInner />
      </AdminContentProvider>
    </AdminAuthGate>
  );
}
