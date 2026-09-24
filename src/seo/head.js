import { createContext } from 'react';
import { company } from '../data/sunriseData';
import { SITE_URL } from '../site';
import { organizationSchema } from './schema';

/** Server-side collector: the pre-renderer passes { current } and reads it after rendering. */
export const HeadContext = createContext(null);

const DEFAULT_IMAGE = '/assets/images/company/company-about.jpg';

export function buildHead({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website', jsonLd = [], noindex = false }) {
  const fullTitle = title ? `${title} | ${company.name}` : `${company.name} — ${company.headline}`;
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const cleanBase = base.replace(/\/$/, '');
  let cleanPath = path;
  if (cleanBase && cleanPath.startsWith(cleanBase)) {
    cleanPath = cleanPath.slice(cleanBase.length);
  }
  const url = SITE_URL + (cleanPath === '/' ? '/' : cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
  let cleanImage = image;
  if (cleanBase && cleanImage.startsWith(cleanBase)) {
    cleanImage = cleanImage.slice(cleanBase.length);
  }
  const img = cleanImage.startsWith('http') ? cleanImage : SITE_URL + (cleanImage.startsWith('/') ? cleanImage : '/' + cleanImage);
  return {
    title: fullTitle,
    meta: [
      ['name', 'description', description],
      ['name', 'robots', noindex ? 'noindex, follow' : 'index, follow'],
      ['property', 'og:type', type],
      ['property', 'og:site_name', company.name],
      ['property', 'og:title', fullTitle],
      ['property', 'og:description', description],
      ['property', 'og:url', url],
      ['property', 'og:image', img],
      ['property', 'og:locale', 'en_IN'],
      ['name', 'twitter:card', 'summary_large_image'],
    ],
    canonical: noindex ? null : url,
    jsonLd: [organizationSchema(), ...[].concat(jsonLd).filter(Boolean)],
  };
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Head tags as an HTML string for the pre-rendered page. */
export function renderHead(head) {
  if (!head) return '';
  return [
    `<title>${esc(head.title)}</title>`,
    ...head.meta.filter(([, , v]) => v).map(([attr, key, v]) => `<meta ${attr}="${key}" content="${esc(v)}" data-seo>`),
    head.canonical ? `<link rel="canonical" href="${esc(head.canonical)}" data-seo>` : '',
    ...head.jsonLd.map((j) => `<script type="application/ld+json" data-seo>${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ');
}
