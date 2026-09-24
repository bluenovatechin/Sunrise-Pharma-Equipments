import { company, categories, products, brochureMachines } from './data/sunriseData';

/** Public URL of the site — used for canonical links, sitemap.xml and social previews. */
export const SITE_URL = 'https://bluenovatechin.github.io/Sunrise-Pharma-Equipments';

/** Prepends base URL to static assets like /assets/images/... */
export const asset = (path) => {
  if (!path) return path;
  if (/^(https?:|\/\/|data:|blob:)/i.test(path)) return path;
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

export const tel = (phone) => `tel:${phone.tel}`;
export const whatsappLink = (text = '') =>
  `https://wa.me/${company.contact.mobile.tel.replace('+', '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const mapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.full)}`;

/** Every page that gets pre-rendered at build time (and listed in sitemap.xml). */
export function allRoutes() {
  return [
    '/',
    '/products',
    ...categories.map((c) => c.path),
    ...products.map((p) => p.path),
    '/solutions',
    ...brochureMachines.map((m) => m.path),
    '/about',
    '/faq',
    '/contact',
    '/sitemap',
  ];
}

/** Source values like "1" (no unit) or "Yes" are shown more helpfully. */
export function displayValue(label, value) {
  if (value === undefined || value === null || value === '') return null;
  if (/^\d+$/.test(String(value).trim()) && /delivery|warranty/i.test(label)) return 'Ask for details';
  if (/^yes$/i.test(value) && /warranty/i.test(label)) return 'Included';
  return tidy(value);
}

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

/** First n sentences of a paragraph. */
export const firstSentences = (text, n = 1) => text.split(/(?<=\.)\s+/).slice(0, n).join(' ');

/** Tidy the marketplace's unit spellings for display: "120 Celsius (oC)" → "120 °C", "415V Volt (v)" → "415 V". */
export function tidy(value) {
  return String(value)
    .replace(/\s*Celsius\s*\(oC\)/gi, ' °C')
    .replace(/(\d)\s*V?\s*Volt\s*\(v\)/gi, '$1 V')
    .replace(/\s*Horsepower\s*\(HP\)/gi, ' HP')
    .replace(/\s*Millimeter\s*\(mm\)/gi, ' mm')
    .replace(/\s*Kilograms\s*\(kg\)/gi, ' kg')
    .replace(/\s*Hertz\s*\(HZ\)/gi, ' Hz')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The 2–3 specs a buyer compares first. */
export function keySpecs(p) {
  const s = p.specifications;
  return [
    s.Capacity || s.Size,
    s.Material,
    s['Control Mode'] || s['Automatic Grade'],
  ].filter(Boolean).map(tidy);
}
