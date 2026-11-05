import { defineConfig } from 'astro/config';
import csp from './integrations/csp.mjs';

// En GitHub Pages la web vive en https://<dueño>.github.io/<repo>/; se arma solo con el repo de Actions.
// TODO: reemplazar el dominio cuando esté comprado
const pages = process.env.GITHUB_PAGES === 'true';
const [owner = '', repo = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

export default defineConfig({
  site: pages && owner ? `https://${owner.toLowerCase()}.github.io` : 'https://juansedurando.com.ar',
  base: pages && repo ? `/${repo}` : undefined,
  // recursos.html queda al lado de index.html: las rutas relativas (img/, descargas/) sirven igual
  build: { format: 'file' },
  integrations: [csp()],
});
