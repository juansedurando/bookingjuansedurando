import { defineConfig } from 'astro/config';
import csp from './integrations/csp.mjs';

// Dominio propio de la web. Si cambia (por ejemplo .com en vez de .com.ar), se cambia solo acá
// y en Settings → Pages → Custom domain del repo.
const DOMINIO = 'juansedurando.com.ar';

// Con dominio propio la web vive en la raíz (https://dominio/).
// GITHUB_PAGES_SIN_DOMINIO=true la arma como antes, para https://mateobenitez-dev.github.io/Juanse-Durando-/
const sinDominio = process.env.GITHUB_PAGES_SIN_DOMINIO === 'true';

export default defineConfig({
  site: sinDominio ? 'https://mateobenitez-dev.github.io' : `https://${DOMINIO}`,
  base: sinDominio ? '/Juanse-Durando-' : undefined,
  // recursos.html queda al lado de index.html: las rutas relativas (img/, descargas/) sirven igual
  build: { format: 'file' },
  integrations: [csp()],
});
