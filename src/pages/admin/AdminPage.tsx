import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import type { AdminSection } from './useAdminContent';
import { AdminContentProvider, useAdminStore, isHttpsUrl } from './admin-content-store';
import { AdminAuthGate } from './AdminAuthGate';
import { AdminSidebar } from './AdminSidebar';
import { Overview } from './sections/Overview';
import { ProjectsTable } from './sections/ProjectsTable';
import { BlogTable } from './sections/BlogTable';
import { ComposeWizard } from './sections/compose/ComposeWizard';
import { HeroEditor } from './sections/HeroEditor';
import { HomeEditor } from './sections/HomeEditor';
import { HomepageEditor } from './sections/HomepageEditor';
import { ServicesTable } from './sections/ServicesTable';
import { ServiceComposeWizard } from './sections/service-compose/ServiceComposeWizard';
import { AreasEditor } from './sections/AreasEditor';
import { ContactEditor } from './sections/ContactEditor';
import { PrivacyEditor } from './sections/PrivacyEditor';
import { MediaLibrary } from './sections/MediaLibrary';
import { EditDrawer } from './EditDrawer';
import { Toast } from './Toast';
import { PublishBar } from './PublishBar';
import { SettingsPanel } from './SettingsPanel';

const META: Record<AdminSection, [string, string]> = {
  overview: ['Overview', 'A snapshot of your website content'],
  projects: ['Projects', 'Manage the project gallery shown on your site'],
  blog: ['Blog', 'Write and publish articles'],
  compose: ['Project Templates', 'Pick a template and build a new project page'],
  home: ['Homepage', 'Edit every section of the landing page'],
  about: ['About Page', 'Edit the hero and every section of the about page'],
  services: ['Services', 'Manage the services shown on your site'],
  serviceCompose: ['Service Templates', 'Pick a template and build a service page'],
  areas: ['Service Areas', 'Suburbs and towns you cover'],
  contact: ['Contact & Social', 'Phone, email and social links'],
  privacy: ['Privacy Policy', 'Edit the privacy policy page'],
  media: ['Media Library', 'Browse, upload, rename and delete all stored media'],
  settings: ['Settings', 'Your account and sign out'],
};

const SITE_URL = import.meta.env.BASE_URL;

function AdminInner() {
  const navigate = useNavigate();
  const location = useLocation();
  // The active section lives in the URL (/admin/<section>) so a reload keeps the
  // current page. useLocation() returns the path with the router basename stripped,
  // so /admin → '' (overview) and /admin/projects → 'projects'.
  const seg = location.pathname.split('/')[2] ?? '';
  const section: AdminSection = (Object.keys(META) as AdminSection[]).includes(seg as AdminSection)
    ? (seg as AdminSection)
    : 'overview';
  const setSection = (s: AdminSection) => navigate(s === 'overview' ? '/admin' : `/admin/${s}`);
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
            <ProjectsTable
              projects={content.projects}
              onToggle={(id) => store.toggle('projects', id)}
              onEdit={(id) => {
                // Templated projects edit through the compose wizard (their body lives in `page`);
                // plain projects use the generic card-field drawer.
                const proj = content.projects.find((p) => p.id === id);
                if (proj?.page) { store.editComposed(id); setSection('compose'); }
                else store.openEdit('projects', id);
              }}
              onDelete={(id) => store.deleteItem('projects', id)}
              onNew={() => store.addItem('projects')}
              onNewFromTemplate={() => { store.startCompose(); setSection('compose'); }}
            />
          )}
          {section === 'blog' && (
            <BlogTable posts={content.posts} onToggle={(id) => store.toggle('posts', id)} onEdit={(id) => store.openEdit('posts', id)} onNew={() => store.addItem('posts')} />
          )}
          {section === 'compose' && <ComposeWizard />}
          {section === 'home' && <HomeEditor />}
          {section === 'about' && (
            <div className="flex flex-col gap-5">
              <HeroEditor
                hero={content.hero}
                onChange={store.updateHero}
                onSave={() => store.toast(isHttpsUrl(content.hero.image) ? 'Hero applied — click Save to publish' : 'Image URL must start with https://')}
              />
              <HomepageEditor />
            </div>
          )}
          {section === 'services' && (
            <ServicesTable
              services={content.serviceDetails}
              onToggle={(slug) => store.toggleService(slug)}
              onEdit={(slug) => { store.editServiceComposed(slug); setSection('serviceCompose'); }}
              onDelete={(slug) => store.deleteService(slug)}
              onNewFromTemplate={() => { store.startServiceCompose(); setSection('serviceCompose'); }}
            />
          )}
          {section === 'serviceCompose' && <ServiceComposeWizard />}
          {section === 'areas' && (
            <AreasEditor areas={content.areas} newArea={store.state.newArea} onNewAreaChange={store.setNewArea} onAdd={store.addArea} onRemove={store.removeArea} />
          )}
          {section === 'contact' && (
            <ContactEditor contact={content.contact} onChange={store.updateContact} onSave={() => store.toast('Contact details saved')} />
          )}
          {section === 'privacy' && <PrivacyEditor />}
          {section === 'media' && <MediaLibrary />}
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
