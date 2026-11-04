// Seguridad: escribe una Content-Security-Policy en cada página después del build.
// GitHub Pages no deja poner headers, así que va como <meta> al principio del <head>.
// Solo deja correr scripts propios (y los inline que están en la página, por su hash):
// si alguien llegara a meter código ajeno en la web, el navegador no lo ejecuta.
// Los hashes se calculan solos en cada build, así que se puede editar la web sin tocar esto.
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hash = (code) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`;

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function csp() {
  return {
    name: 'csp-meta',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        for (const file of await htmlFiles(fileURLToPath(dir))) {
          let html = await readFile(file, 'utf8');
          const scripts = [];
          const styles = [];
          for (const [, attrs, code] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
            if (/\bsrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
            scripts.push(hash(code));
          }
          for (const [, code] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) styles.push(hash(code));
          const policy = [
            "default-src 'self'",
            `script-src 'self' ${scripts.join(' ')}`.trim(),
            `style-src 'self' https://fonts.googleapis.com ${styles.join(' ')}`.trim(),
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data:",
            "media-src 'self'",
            "connect-src 'self'",
            "object-src 'none'",
            "frame-src 'none'",
            "base-uri 'self'",
            "form-action 'none'",
            'upgrade-insecure-requests',
          ].join('; ');
          const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="strict-origin-when-cross-origin">`;
          html = html.replace(/<meta charset="utf-8"\s*\/?>/i, (m) => m + meta);
          await writeFile(file, html);
        }
        logger.info('CSP agregada a las páginas');
      },
    },
  };
}
