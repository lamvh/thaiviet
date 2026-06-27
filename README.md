# ThaiViet Ltd — React + Vite + TypeScript

Component-based rebuild of the ThaiViet site.

## Run

```bash
cd react-app
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Tailwind is configured via `tailwind.config.js` (brand tokens) + `postcss.config.js`.
Fonts (Manrope / Work Sans) and Material Symbols load from Google Fonts in `index.html`.

## Component tree

```
App (router)
└─ Layout
   ├─ Header
   │  ├─ ServicesDropdown
   │  └─ FacebookIcon
   ├─ <page>            (Routes render here)
   ├─ Footer
   └─ ChatWidget        (uses hooks/useChat)

pages/
  HomePage · ServicesPage · ProjectsPage · ProjectDetailPage · BlogPage · ContactPage

components/
  ui/      Icon · Container · CTASection
  cards/   ServiceCard · ProjectCard · BlogCard · VlogCard
  layout/  Header · Footer · Layout · ChatWidget · ServicesDropdown · FacebookIcon
  ProjectFilter

hooks/     useChat · useContactForm
data/      nav · services · projects · project-details · posts · reels · areas
lib/       types.ts
```

## Routes
`/` Home · `/services` · `/projects` · `/projects/:id` (case study) · `/blog` · `/contact`

## Where to wire real backends
- `hooks/useChat.ts` — replace the mock `setTimeout` with `POST /api/chat`.
- `hooks/useContactForm.ts` — replace the mock submit with your form endpoint.
- Routing uses `BrowserRouter`; for static hosting add an SPA fallback to `index.html`.

## Notes
- All page content lives in `data/*` so you can swap copy/images without touching components.
- `logo.webp` and the chat avatar load from `project.vinapage.com`; drop local copies in `public/` and update the paths in `Header.tsx` / `ChatWidget.tsx` for production.
- Video walkthroughs (Customer Reviews + Service Reels) are Facebook iframes (data in `data/reels.ts`), rendered at the bottom of `BlogPage` so all content lives on one article page.
- The Projects filter is pure client state (`useState` + `useMemo`) in `ProjectsPage.tsx`.
- Project cards link to `/projects/:id`. `ProjectDetailPage` renders a rich case study from `data/project-details.ts` (keyed by project id) and falls back to the base project fields (image, title, category, desc) for projects without a detail entry.
