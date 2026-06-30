import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Content-Security-Policy injected into the PRODUCTION build only (dev needs ws: for HMR).
// connect-src is the key control: an injected script cannot fetch the localStorage PAT to
// an attacker origin — only api.github.com is allowed. img-src stays broad (content images),
// so img-beacon exfil remains a documented residual risk.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' https: data:",
  "connect-src 'self' https://api.github.com https://cwcyjnlkkiqmwvueiilg.supabase.co",
  "frame-src https://www.facebook.com https://web.facebook.com",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }];
    },
  };
}

// base defaults to '/' so the app works at a domain root (Vercel, Netlify, custom domain,
// local dev). The GitHub Pages PROJECT site is served under /thaiviet/, so its build sets
// VITE_BASE=/thaiviet/ (see .github/workflows/deploy.yml). Hardcoding /thaiviet/ for all
// builds 404s every asset on root-served hosts → blank page.
export default defineConfig(() => ({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), cspPlugin()],
}));
