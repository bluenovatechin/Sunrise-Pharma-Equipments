/**
 * Turns the client build into a static, SEO-friendly site:
 *   - one real HTML file per route (dist/<route>/index.html) with its own <head>
 *   - dist/404.html
 *   - redirect pages at every old-site URL (e.g. /vacuum-tray-dryer.html)
 *   - sitemap.xml and robots.txt
 * Runs after `vite build` and `vite build --ssr` (see package.json).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, allRoutes, SITE_URL, navigation } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const base = '/Sunrise-Pharma-Equipments/';

const page = (url, route = url) => {
  let { html, head } = render(url);
  html = html
    .replaceAll('src="/assets/', `src="${base}assets/`)
    .replaceAll('href="/assets/', `href="${base}assets/`);
  return template
    .replace('<!--app-head-->', head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${route}">${html}</div>`);
};
const write = (rel, content) => {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const routes = allRoutes();
for (const url of routes) {
  const html = page(url);
  if (url === '/') { write('index.html', html); continue; }
  // Both forms, so "/about" and "/about/" work on every static host without rewrite rules.
  write(`${url.slice(1)}/index.html`, html);
  write(`${url.slice(1)}.html`, html);
}
write('404.html', page('/404', ''));

const siteBase = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;

// Old .html URLs → new pages. Hosts that support it should also add real 301s (see public/_redirects).
let redirects = 0;
for (const [from, to] of Object.entries(navigation.legacyRedirects)) {
  if (from === '/index.html') continue;
  // Static hosts resolve "/products" to "products.html" before "products/index.html", so a
  // redirect file there would loop. Serve the real page instead (its canonical points to the new URL).
  if (from === `${to}.html`) {
    write(from.slice(1), page(to));
    redirects++;
    continue;
  }
  const target = siteBase + to;
  write(from.slice(1), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title>
<link rel="canonical" href="${target}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)})</script></head><body><a href="${target}">This page has moved.</a></body></html>`);
  redirects++;
}
write('_redirects', Object.entries(navigation.legacyRedirects).filter(([f]) => f !== '/index.html').map(([f, t]) => `${f}  ${siteBase + t}  301`).join('\n') + '\n');

const today = new Date().toISOString().slice(0, 10);
const priority = (u) => (u === '/' ? '1.0' : u.split('/').length <= 2 ? '0.8' : '0.7');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((u) => `  <url><loc>${siteBase}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteBase}/sitemap.xml\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length} pages + 404, ${redirects} legacy redirects, sitemap.xml, robots.txt`);
