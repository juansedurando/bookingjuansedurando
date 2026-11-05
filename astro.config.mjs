import { defineConfig } from 'astro/config';
import csp from './integrations/csp.mjs';

// Dominio propio de la web.
const DOMINIO = 'bookingjuansedurando.com';
// Cuando el dominio esté conectado en Settings → Pages, cambiar a true.
const CON_DOMINIO = false;

// Sin dominio, en GitHub Pages la web vive en https://<dueño>.github.io/<repo>/ (se arma solo con el repo).
const pages = process.env.GITHUB_PAGES === 'true' && !CON_DOMINIO;
const [owner = '', repo = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

export default defineConfig({
  site: pages && owner ? `https://${owner.toLowerCase()}.github.io` : `https://${DOMINIO}`,
  base: pages && repo ? `/${repo}` : undefined,
  // recursos.html queda al lado de index.html: las rutas relativas (img/, descargas/) sirven igual
  build: { format: 'file' },
  integrations: [csp()],
});
