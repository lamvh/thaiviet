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
  "connect-src 'self' https://api.github.com",
  "frame-src https://www.facebook.com",
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

// base: '/' for local dev (home `/`, admin `/admin`); '/thaiviet/' for the production
// build that ships to the GitHub Pages project site (https://lamvh.github.io/thaiviet/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/thaiviet/' : '/',
  plugins: [react(), cspPlugin()],
}));
