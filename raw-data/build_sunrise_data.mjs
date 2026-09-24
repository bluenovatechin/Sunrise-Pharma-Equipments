/**
 * Builds src/data/sunriseData.js — the single merged data file for the site.
 *
 * Sources (all inside raw-data/):
 *   - raw_html/*.html                  → products, categories, page text, SEO, JSON-LD
 *   - website-data/data.js             → hand-transcribed brochure + company text (verified)
 *   - url_to_local_map.json            → remote image URL → local /assets path
 *
 * Run:  node raw-data/build_sunrise_data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { CATEGORY_GUIDES, CATEGORY_IMAGES, MACHINE_IMAGES, MACHINE_SUMMARIES, HOW_WE_WORK, buildCompanyFaqs } from './editorial.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlDir = path.join(here, 'raw_html');
const outFile = path.join(here, '..', 'src', 'data', 'sunriseData.js');
const publicDir = path.join(here, '..', 'public');

const legacy = await import(pathToFileURL(path.join(here, 'website-data', 'data.js')).href);
const urlToLocal = JSON.parse(fs.readFileSync(path.join(here, 'url_to_local_map.json'), 'utf8'));

// ---------------------------------------------------------------- helpers

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', deg: '°', plusmn: '±', times: '×' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
const text = (html = '') =>
  decode(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const read = (f) => fs.readFileSync(path.join(htmlDir, f), 'utf8');
const attr = (html, re) => decode((html.match(re) || [])[1] || '').trim();
const local = (url) => urlToLocal[url] || urlToLocal[url.replace('.com//', '.com/')] || null;

function seoOf(html) {
  return {
    title: text(attr(html, /<title>([\s\S]*?)<\/title>/i)),
    description: attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    keywords: attr(html, /<meta\s+name="keywords"\s+content="([^"]*)"/i),
    canonical: attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
  };
}

function jsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b[1]);
      if (j['@type'] === 'Product') return j;
    } catch {}
  }
  return null;
}

// `<ul class="pro_details_list"><li>Label</li><li>Value</li></ul>` blocks after a given <h2>.
function detailList(html, headingSuffix) {
  const m = html.match(new RegExp(`<h2>[^<]*${headingSuffix}<\\/h2>[\\s\\S]*?<div class=["']pro_details-div["']>([\\s\\S]*?)<\\/div>`, 'i'));
  const out = {};
  if (!m) return out;
  for (const ul of m[1].matchAll(/<ul class=["']pro_details_list["']>([\s\S]*?)<\/ul>/gi)) {
    const lis = [...ul[1].matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((x) => text(x[1]));
    if (lis.length >= 2 && lis[0]) out[lis[0]] = lis[1];
  }
  return out;
}

function parsePrice(raw) {
  const m = raw.match(/([\d,.]+)\s*([A-Z]{3})\s*\/\s*(.+)$/);
  if (!m) return null;
  return { amount: Math.round(parseFloat(m[1].replace(/,/g, ''))), currency: m[2], unit: cap(m[3].trim()) };
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const inr = (n) => '₹' + n.toLocaleString('en-IN');
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const idFromHref = (href) => (href.match(/-(\d{8})\.html/) || [])[1] || null;

// ---------------------------------------------------------------- categories (products.html is the canonical list + order)

const productsHtml = read('products.html');

// Category page files, keyed by the category name shown in product breadcrumbs.
const CATEGORY_FILES = [
  { file: 'ointment-manufacturing-plant.html', name: 'Ointment Manufacturing Plant', id: 'ointment-manufacturing-plant' },
  { file: 'liquid-oral-manufacturing-plant.html', name: 'Liquid Oral Manufacturing Plant', id: 'liquid-oral-manufacturing-plant' },
  { file: 'vacuum-tray-dryer.html', name: 'Vacuum Tray Dryer', id: 'vacuum-tray-dryer' },
  { file: 'automatic-sealing-machine.html', name: 'Automatic Bottle Cap Sealing Machine', id: 'bottle-cap-sealing-machine' },
  { file: 'automatic-syrup-bottle-filling-machine-.html', name: 'Automatic Syrup Bottle Filling Machine', id: 'syrup-bottle-filling-machine' },
  // The sticker labeling "category" on the live site links straight to its only product page.
  { file: null, name: 'Automatic Sticker Labeling Machine', id: 'sticker-labeling-machine', liveUrl: '/automatic-sticker-labeling-machine-10958001.html' },
];

// Short blurbs shown on products.html: <div class="prod_cat_name"><a>Name</a></div><div class="prod_cat_descr">...</div>
const shortBlurbs = {};
for (const m of productsHtml.matchAll(/<div class="(?:alt_)?prod_cat_name">\s*<a[^>]*>([^<]+)<\/a>\s*<\/div>\s*<div class="(?:alt_)?prod_cat_descr">\s*<div[^>]*>([\s\S]*?)<\/div>/gi)) {
  const c = CATEGORY_FILES.find((x) => x.name === text(m[1]));
  if (c) shortBlurbs[c.id] = text(m[2]);
}

const categories = CATEGORY_FILES.map((c, order) => {
  const html = c.file ? read(c.file) : null;
  const description = html ? text((html.match(/<div class="prod_descr_matter">([\s\S]*?)<\/div>/i) || [])[1]) : '';
  return {
    id: c.id,
    name: c.name,
    order: order + 1,
    shortDescription: shortBlurbs[c.id] || '',
    // Two categories have no long intro on the live site; fall back to the products-page blurb.
    description: description || shortBlurbs[c.id] || '',
    liveUrl: c.file ? '/' + c.file : c.liveUrl,
    seo: html ? seoOf(html) : null,
    productIds: [], // filled below from product breadcrumbs
  };
});
const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

// ---------------------------------------------------------------- products

const productFiles = fs.readdirSync(htmlDir).filter((f) => /-\d{8}\.html$/.test(f));
const LISTING_FIELDS = new Set([
  'Payment Terms', 'Supply Ability', 'Delivery Time', 'Packaging Details', 'Main Domestic Market', 'Main Export Market(s)',
  'Moq', 'Mop', 'Currency', 'Stock Quantity', 'Unit Type', 'Product Unit', 'Price', 'Price Type', 'Brand Name',
  'Returnable', 'Minimum Order Quantity', 'Minimum Ordered Packs', 'GSTIN', 'Sample Available', 'Sample Policy', 'Certifications',
]);
const productIdsInMenuOrder = [...read('index.html').matchAll(/href="\/[a-z0-9-]+-(\d{8})\.html"/g)].map((m) => m[1]);

const products = productFiles.map((file) => {
  const html = read(file);
  const id = file.match(/-(\d{8})\.html$/)[1];
  const ld = jsonLd(html);

  const name = text((html.match(/<div[^>]*class=["']product_title["'][^>]*>\s*<h1>([\s\S]*?)<\/h1>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);
  const breadcrumbs = [...html.matchAll(/<li[^>]*itemprop="itemListElement"[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => text(m[1])).filter(Boolean);
  const category = categoryByName[breadcrumbs[2]];
  if (!category) throw new Error(`No category for ${file}: ${breadcrumbs.join(' > ')}`);

  // Price: visible price first, then JSON-LD offer as fallback (one product hides the visible price).
  const priceRaw = text((html.match(/<div[^>]*class=["']product_price_div["'][^>]*>\s*<h2>([\s\S]*?)<\/h2>/i) || [])[1]);
  const moqRaw = text((html.match(/<div[^>]*class=["']quantity["'][^>]*>([\s\S]*?)<\/div>/i) || [])[1]);
  const moqM = moqRaw.match(/:\s*([\d.]+)\s*(.+)$/);
  let price = parsePrice(priceRaw);
  let priceSource = 'product page';
  if (!price && ld?.offers?.price) {
    price = { amount: Math.round(+ld.offers.price), currency: ld.offers.priceCurrency || 'INR', unit: moqM ? cap(moqM[2]) : 'Unit' };
    priceSource = 'structured data (price hidden on product page)';
  }

  const specifications = detailList(html, 'Specification');
  const tradeInformation = detailList(html, 'Trade Information');

  // "About" block: optional spec table, prose paragraphs, then FAQs.
  const aboutHtml = (html.match(/<h2>[^<]*About<\/h2>([\s\S]*?)(?=<div class=["']gallery-image|<h2 class="expoloreTitle"|$)/i) || [])[1] || '';
  const faqStart = aboutHtml.search(/<h2[^>]*>\s*FAQs? of/i);
  const aboutMain = faqStart >= 0 ? aboutHtml.slice(0, faqStart) : aboutHtml;
  const faqHtml = faqStart >= 0 ? aboutHtml.slice(faqStart) : '';

  // Packaging machines carry an extra table here. Product attributes go to detailedSpecifications;
  // TradeIndia listing fields (stock, approx. price, GSTIN...) go to listingDetails.
  const detailedSpecifications = {};
  const listingDetails = {};
  for (const tr of aboutMain.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const tds = [...tr[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => text(m[1]));
    if (tds.length >= 2 && tds[0]) (LISTING_FIELDS.has(tds[0]) ? listingDetails : detailedSpecifications)[tds[0]] = tds[1];
  }
  const prose = aboutMain.replace(/<table[\s\S]*?<\/table>/gi, '');
  const paragraphs = prose
    .split(/<br\s*\/?>\s*<br\s*\/?>|<\/p>|<\/div>/i)
    .map(text)
    .filter((p) => p.length > 30);

  const faqTitle = text((faqHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1]).replace(/:$/, '');
  const faqs = [];
  for (const m of faqHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi)) {
    const q = text(m[1]).replace(/^Q\s*:\s*:?\s*/i, '');
    const a = text(m[2]).replace(/^A\s*:\s*:?\s*/i, '');
    if (q && a) faqs.push({ question: q, answer: a });
  }

  // Images: product image + "extra" gallery shots, mapped to local copies.
  const remote = [...new Set([...html.matchAll(/<div class=["'](?:gallery-image|imgCnt)["']>[\s\S]*?<img src=["']([^"']+)["']/gi)].map((m) => m[1]))];
  if (ld?.image && !remote.includes(ld.image)) remote.unshift(ld.image);
  const gallery = remote.map((u) => ({ src: local(u), remote: u })).filter((g) => g.src);

  // "More Products in <Category> Category" strip.
  const moreHtml = (html.match(/More Products in[\s\S]*$/i) || [''])[0].split(/<footer|class="footer/i)[0];
  const relatedProductIds = [...new Set([...moreHtml.matchAll(/href="\/([^"]+)"/g)].map((m) => idFromHref(m[1])).filter((x) => x && x !== id))];

  return {
    id,
    slug: slugify(name),
    name,
    categoryId: category.id,
    liveUrl: '/' + file,
    price: price
      ? { ...price, display: `${inr(price.amount)} / ${price.unit}`, source: priceSource }
      : null,
    moq: moqM ? { quantity: +moqM[1], unit: cap(moqM[2]), display: `${moqM[1]} ${cap(moqM[2])}` } : null,
    image: gallery[0]?.src || null,
    gallery: gallery.map((g) => g.src),
    specifications,
    detailedSpecifications: Object.keys(detailedSpecifications).length ? detailedSpecifications : undefined,
    tradeInformation,
    listingDetails: Object.keys(listingDetails).length ? listingDetails : undefined,
    // Pages whose About block is only a table have no real prose (their JSON-LD text is the table flattened),
    // so fall back to the meta description there.
    description: paragraphs.join('\n\n') || attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    descriptionSource: paragraphs.length ? undefined : 'meta description (live page has no product text)',
    faqTitle: faqs.length ? faqTitle : undefined,
    faqs,
    relatedProductIds,
    structuredData: ld
      ? {
          brand: ld.brand,
          category: ld.category,
          availability: (ld.offers?.availability || '').replace('https://schema.org/', ''),
          condition: (ld.offers?.itemCondition || '').replace('https://schema.org/', '').replace('Condition', ''),
          deliveryLeadTime: ld.offers?.deliveryLeadTime,
        }
      : undefined,
    seo: seoOf(html),
    remoteImage: gallery[0]?.remote || null,
  };
});

// Some category listings show a "Key Features" box per product (only on the sealing machine page today).
for (const c of CATEGORY_FILES.filter((x) => x.file)) {
  const html = read(c.file);
  for (const m of html.matchAll(/<div class="proDTextArea[^"]*">([\s\S]*?)<\/div>\s*<div class="moreTextViewBtn"><a href="\/([^"]+)"/gi)) {
    const p = products.find((x) => x.id === idFromHref(m[2]));
    if (!p) continue;
    p.keyFeatures = Object.fromEntries(
      decode(m[1]).split('\n').map((l) => l.trim().split(/\s*:\s*/)).filter((kv) => kv.length === 2 && kv[0]).map(([k, v]) => [k, v]),
    );
  }
}

// Category order on the site menu, then by name.
const menuPos = (id) => { const i = productIdsInMenuOrder.indexOf(id); return i < 0 ? 999 : i; };
products.sort((a, b) => {
  const ca = categories.findIndex((c) => c.id === a.categoryId);
  const cb = categories.findIndex((c) => c.id === b.categoryId);
  return ca - cb || menuPos(a.id) - menuPos(b.id) || a.name.localeCompare(b.name);
});
// Two products share the name "Ointment Manufacturing Plant"/"Liquid Oral Manufacturing Plant" with their category;
// slugs are still unique because categories use their own id namespace. Guard against real duplicates anyway.
const seen = new Set();
for (const p of products) {
  if (seen.has(p.slug)) p.slug = `${p.slug}-${p.id}`;
  seen.add(p.slug);
  categoryByName[categories.find((c) => c.id === p.categoryId).name].productIds.push(p.id);
}

// ---------------------------------------------------------------- homepage lists (from index.html)

const indexHtml = read('index.html');
const heroBanners = [...indexHtml.matchAll(/<a href="([^"]+)"><img src="(https:\/\/cpimg\.tistatic\.com\/156330\/7\/template_photo_\d+\.jpg)"/g)].map((m, i) => ({
  image: local(m[2]),
  link: m[1],
  linksTo: idFromHref(m[1]) ? { type: 'product', id: idFromHref(m[1]) } : { type: 'category', id: CATEGORY_FILES.find((c) => '/' + c.file === m[1])?.id },
  order: i + 1,
}));
const popularIds = [...indexHtml.matchAll(/<a href="\/[a-z0-9-]+-(\d{8})\.html"><img alt=/g)].map((m) => m[1]);
const socialLinks = {
  facebook: attr(indexHtml, /href="(https:\/\/www\.facebook\.com\/[^"]+)"/),
  youtube: attr(indexHtml, /href="(https:\/\/www\.youtube\.com\/[^"]+)"/),
  tradeIndiaTrustStamp: attr(indexHtml, /href="(https:\/\/www\.tradeindia\.com\/truststamp-member\/[^"]+)"/),
  tradeIndiaCreditReport: attr(indexHtml, /href="(https:\/\/www\.tradeindia\.com\/credit_reports\/[^"]+)"/),
};

// ---------------------------------------------------------------- brochure (verified page-by-page against the PDF)

const bp = legacy.brochureData.pages;
const sparkler = bp[6].keyFeaturesProductsAndServices;
// Fix a bullet the PDF itself wraps across two lines; keep the rest verbatim.
const sparklerFeatures = [];
for (let i = 0; i < sparkler.length; i++) {
  if (sparkler[i].endsWith('in the filter') && sparkler[i + 1]?.startsWith('press ')) {
    sparklerFeatures.push(`${sparkler[i]} ${sparkler[i + 1]}`);
    i++;
  } else if (!sparkler[i].startsWith('AVAILABLE CAPACITIES')) sparklerFeatures.push(sparkler[i]);
}
const machine = (name) => bp.flatMap((p) => p.machines || []).find((m) => m.machineName === name).features;

const brochureMachines = [
  {
    id: 'syrup-manufacturing-plant', name: 'Syrup Manufacturing Plant', brochurePage: 2, categoryId: 'liquid-oral-manufacturing-plant', line: 'process',
    description: bp[1].description,
    keyFeatures: bp[1].keyFeaturesProductsAndServices,
    capacity: '500 - 10,000 Ltrs',
    processEquipments: bp[1].processEquipments,
  },
  {
    id: 'ointment-manufacturing-plant', name: 'Ointment Manufacturing Plant', brochurePage: 3, categoryId: 'ointment-manufacturing-plant', line: 'process',
    keyFeatures: bp[2].keyFeaturesProductsAndServices,
    processEquipments: {
      'Wax Vessel': bp[2].processEquipments.waxVessel,
      'Water Vessel': bp[2].processEquipments.waterVessel,
      'Main Vessel': bp[2].processEquipments.mainVessel,
    },
  },
  {
    id: 'vacuum-tray-dryer', name: 'Vacuum Tray Dryer', brochurePage: 4, categoryId: 'vacuum-tray-dryer', line: 'process',
    modelRange: 'SPEVTD 6 to 96 Tray',
    keyFeatures: bp[3].keyFeaturesProductsAndServices,
  },
  { id: 'bottle-unscrambler', name: 'Bottle Unscrambler', brochurePage: 5, categoryId: null, line: 'packaging', keyFeatures: machine('BOTTLE UNSCRAMBLER') },
  { id: 'air-jet-cleaning-machine', name: 'Air Jet Cleaning Machine', brochurePage: 5, categoryId: null, line: 'packaging', keyFeatures: machine('AIR JET CLEANING MACHINE') },
  { id: 'liquid-filling-machine', name: 'Liquid Filling Machine', brochurePage: 5, categoryId: 'syrup-bottle-filling-machine', line: 'packaging', keyFeatures: machine('LIQUID FILLING MACHINE') },
  { id: 'capping-machine', name: 'Capping Machine', brochurePage: 6, categoryId: 'bottle-cap-sealing-machine', line: 'packaging', keyFeatures: machine('CAPPING MACHINE') },
  { id: 'sticker-labelling-machine', name: 'Sticker Labelling Machine', brochurePage: 6, categoryId: 'sticker-labeling-machine', line: 'packaging', keyFeatures: machine('STICKER LABELLING MACHINE') },
  { id: 'visual-inspection-machine', name: 'Visual Inspection Machine', brochurePage: 6, categoryId: null, line: 'packaging', keyFeatures: machine('VISUAL INSPECTION MACHINE') },
  {
    id: 'sparkler-filter-press', name: 'Sparkler Filter Press', brochurePage: 7, categoryId: null, line: 'process',
    keyFeatures: sparklerFeatures,
    availableCapacities: ['8"', '14"', '18"', '24"'],
    availableCapacitiesText: 'Standard models 8", 14", 18", and 24".',
  },
];
for (const m of brochureMachines) {
  m.path = `/solutions/${m.id}`;
  m.summary = MACHINE_SUMMARIES[m.id];
  m.image = MACHINE_IMAGES[m.id];
}
for (const c of categories) {
  c.brochureMachineIds = brochureMachines.filter((m) => m.categoryId === c.id).map((m) => m.id);
  c.path = `/products/${c.id}`;
  c.image = CATEGORY_IMAGES[c.id];
  c.guide = CATEGORY_GUIDES[c.id];
  const amounts = c.productIds.map((id) => products.find((p) => p.id === id).price?.amount).filter(Boolean);
  c.priceFrom = Math.min(...amounts);
}
for (const p of products) p.path = `/products/${p.categoryId}/${p.slug}`;

// ---------------------------------------------------------------- assemble

const leg = legacy;
const ab = leg.aboutCompany;
const pageSeo = (f) => seoOf(read(f));

const company = {
  name: 'Sunrise Pharma Equipments',
  shortName: 'SPE',
  tagline: 'Perfection is well-represented in the quality of our products',
  headline: 'Manufacturer & Exporter of Pharmaceuticals Machineries',
  focus: 'Process & Packaging for Liquid & Ointment',
  topBarText: 'Trusted company that deals in quality-made products',
  natureOfBusiness: ['Supplier', 'Manufacturer', 'Exporter'],
  yearOfEstablishment: 2019,
  numberOfEmployees: 20,
  legal: { gstNumber: '24FPCPP3063N1ZK', ieCode: 'FPCPP3063N' },
  people: [
    { name: 'Mr. Jay Prajapati', shortName: 'Mr. Jay', role: 'Proprietor', isPrimaryContact: true },
    { name: 'Mr. Jayendra Prajapati Chandubhai', role: 'Mentor', note: 'Credited on the Company Profile page for consistent support and guidance.' },
  ],
  contact: {
    // The website lists the TradeIndia call-routing number; the brochure lists the direct mobile.
    phone: { display: '07971550471', tel: '+917971550471', source: 'website' },
    mobile: { display: '+91 98799 97722', tel: '+919879997722', source: 'brochure' },
    email: 'sales.sunrisepharma@gmail.com',
    businessHours: { display: 'Mon - Sat 8:00 - 6:30, Sunday - CLOSED', days: 'Monday - Saturday', open: '08:00', close: '18:30', closed: ['Sunday'] },
  },
  addresses: {
    office: {
      label: 'Office',
      line1: 'L-4132/1/2, Phase 4, GIDC, Vatva',
      city: 'Ahmedabad', state: 'Gujarat', postalCode: '382445', country: 'India',
      full: 'L-4132/1/2, Phase 4, GIDC, Vatva, Ahmedabad - 382445, Gujarat, India',
    },
    factory: {
      label: 'Regd. Office & Factory',
      line1: 'Plot No. 4 Dev Industrial Estate, Opp. Pushkar Industrial Estate Phase-1, Vatva GIDC, Vatva',
      city: 'Ahmedabad', state: 'Gujarat', postalCode: '382445', country: 'India',
      full: 'Plot No. 4 Dev Industrial Estate, Opp. Pushkar Industrial Estate Phase-1, Vatva GIDC, Vatva, Ahmedabad - 382445, Gujarat, India',
    },
  },
  location: 'Ahmedabad, Gujarat, India',
  websites: { primary: 'https://www.sunrisepharmamachine.com', alternate: 'https://www.sunrisepharma.in', hindi: 'https://www.sunrisepharmamachine.com/hi/' },
  social: socialLinks,
  logistics: {
    modesOfTransport: ['By Air', 'Rail', 'Road'],
    modesOfPayment: ['Online Payments (NEFT/RTGS/IMPS)', 'Cheque/DD', 'Wallet and UPI'],
    domesticMarket: 'All India',
    exportMarkets: ['Western Europe', 'Asia', 'Eastern Europe', 'Australia', 'South America', 'Central America', 'North America', 'Middle East', 'Africa'],
  },
  keyFacts: [
    { label: 'Nature of Business', value: 'Supplier, Manufacturer, Exporter' },
    { label: 'Location', value: 'Ahmedabad, Gujarat, India' },
    { label: 'Year of Establishment', value: '2019', icon: '/assets/images/company/year-of-establishment.jpg', highlight: true },
    { label: 'Number of Employees', value: '20', icon: '/assets/images/company/no-of-staff.jpg', highlight: true },
    { label: 'Import Percentage', value: 'Available Upon Request', icon: '/assets/images/company/import-percentage.jpg', highlight: true },
    { label: 'Warehousing Facility', value: 'Yes', icon: '/assets/images/company/warehousing-facility.jpg', highlight: true },
    { label: 'IE Code', value: 'FPCPP3063N' },
    { label: 'GST Number', value: '24FPCPP3063N1ZK' },
    { label: 'Modes of Transport', value: 'By Air, Rail, Road' },
    { label: 'Modes of Payments', value: 'Online Payments (NEFT/RTGS/IMPS), Cheque/DD, Wallet and UPI' },
  ],
  trustBadge: { title: 'Trusted Seller', platform: 'TradeIndia Member', image: '/assets/images/icons/trusted-seller.svg', link: socialLinks.tradeIndiaTrustStamp },
  logo: { src: '/assets/images/logo/logo.png', alt: 'Sunrise Pharma Equipments' },
  brochurePdf: '/assets/brochure/sunrise-pharma-equipments-brochure.pdf',
};

company.faqs = buildCompanyFaqs({ company, categories, products, brochureMachines });
company.howWeWork = HOW_WE_WORK;

const [about1, about2] = leg.companyInformation.paragraphs;
const pages = {
  home: {
    seo: pageSeo('index.html'),
    heroBanners,
    heading: leg.homepage.mainHeadingH1,
    featured: {
      productId: '10543092',
      eyebrow: 'Supplier, Manufacturer',
      text: leg.homepage.featuredProductShowcase.description.replace(/\s*Click$/, ''),
      ctaLabel: 'Click Here to View All',
      ctaLink: '/products.html',
      backgroundImage: '/assets/images/banners/vision-bg.jpg',
    },
    bestCategories: { title: 'Our Best Categories', categoryIds: categories.map((c) => c.id) },
    popularProducts: {
      title: 'Most Popular Products',
      subtitle: 'Manufactures and supplies Stainless Steel Vacuum Tray Dryer Machine, Pharmaceutical Ointment Manufacturing Plant, Automatic Liquid Syrup Manufacturing Processing Plant, Industrial Vacuum Tray Dryer, Automatic SS Vacuum Tray Dryer, and more.',
      productIds: popularIds,
    },
    howWeWork: { title: 'How We Work', subtitle: 'Hundreds of customers trust our company', image: '/assets/images/company/feature-section.png' },
    about: { eyebrow: 'About', heading: 'Sunrise Pharma Equipments', text: about1, image: '/assets/images/company/about-intro-feature.jpg', readMoreLink: '/company-information.html' },
  },
  companyProfile: {
    seo: pageSeo('company-profile.html'),
    title: 'Company Profile',
    banner: '/assets/images/banners/company-profile-banner.jpg',
    intro: [ab.companyIntroduction.split('For our success story')[0].trim(), 'For our success story' + ab.companyIntroduction.split('For our success story')[1]].filter((s) => s.length > 20),
    sections: [
      { id: 'team', title: 'Our Team', paragraphs: splitParas(ab.ourTeam.description), listTitle: 'Few of the professionals who work for us are as follows:', list: ab.ourTeam.roles },
      { id: 'why-us', title: 'Why Us?', paragraphs: splitParas(ab.whyUs.description), listTitle: 'The reasons that have made us successful are as follows:', list: ab.whyUs.reasons },
      { id: 'infrastructure', title: 'Infrastructure', paragraphs: splitParas(ab.infrastructure.description) },
    ],
    keyFactsTitle: 'Key Facts of Sunrise Pharma Equipments',
  },
  companyInformation: {
    seo: pageSeo('company-information.html'),
    title: 'Company Information',
    banner: '/assets/images/banners/company-information-banner.jpg',
    paragraphs: [about1, about2],
  },
  products: {
    seo: pageSeo('products.html'),
    title: 'Our Products',
    banner: '/assets/images/banners/products-banner.jpg',
  },
  contact: {
    seo: pageSeo('contact-us.html'),
    title: 'Contact Details',
    exitIntent: { heading: "Don't leave just yet!", message: "We're just a click away to help you with all your queries.", buttonText: 'Post an inquiry' },
  },
  sitemap: { seo: pageSeo('sitemap.html'), title: 'Site Map' },
};

function splitParas(s) {
  return s.split(/\n+|(?<=\.)\s+(?=We have hired|Due to the higher|We possess a first-class|Few of the|The reasons that)/)
    .map((x) => x.trim())
    .filter((x) => x && !/^(Few of the professionals|The reasons that have made)/.test(x));
}

const navigation = {
  header: [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products', megaMenu: 'categories' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ],
  footerQuickLinks: [
    { label: 'Home', path: '/' },
    { label: 'All Products', path: '/products' },
    { label: 'Process & Packaging Solutions', path: '/solutions' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Sitemap', path: '/sitemap' },
  ],
  footerCopyright: 'Sunrise Pharma Equipments. All Rights Reserved.',
  // Every URL of the old site → its page on the new site.
  legacyRedirects: {
    '/index.html': '/',
    '/company-profile.html': '/about',
    '/company-information.html': '/about',
    '/products.html': '/products',
    '/contact-us.html': '/contact',
    '/sitemap.html': '/sitemap',
    '/brochure': '/#brochure',
    '/brochure.html': '/#brochure',
    ...Object.fromEntries(categories.map((c) => [c.liveUrl, c.path])),
    ...Object.fromEntries(products.map((p) => [p.liveUrl, p.path])),
  },
};

const forms = {
  requestQuote: {
    title: 'Request A Quote',
    description: leg.formsAndCtas.requestAQuoteForm.description,
    fields: leg.formsAndCtas.requestAQuoteForm.fields.map(({ name, ...f }) => ({ name: name.replace(/^vinfo_/, ''), ...f })),
    submitLabel: 'Submit',
    otp: { title: 'OTP Verification', instruction: 'Authenticate with the 4 digit One Time Password (OTP) sent to your registered email Id / mobile number', resendText: 'Did not receive yet? Resend OTP', errorText: 'Wrong Verification Code' },
    success: { title: 'Thank you!', message: 'We have received your requirements' },
  },
  productInquiry: {
    title: 'Tell us about your requirement',
    tabs: ['Get Quotation', 'Get Price List', 'Discuss Requirement'],
    fields: [
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'unit', label: 'Select Unit', type: 'select' },
      { name: 'details', label: 'Additional detail', type: 'textarea' },
      { name: 'mobile', label: 'Mobile number', type: 'tel', required: true, error: 'Mobile No. is needed for Inquiry.' },
      { name: 'email', label: 'Email', type: 'email', required: true, error: 'Email id is needed for Inquiry.' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'company', label: 'Company Name', type: 'text' },
      { name: 'cityState', label: 'City / State', type: 'text' },
    ],
    submitLabel: 'Contact Now',
    immediateResponseText: 'For an immediate response, please call this number 07971550471',
    success: { title: "You're Done!", message: 'We have received your requirements and will reply shortly with the best price.' },
  },
  ctas: { sendInquiry: 'Send Inquiry', getQuote: 'Get a Price/Quote', callback: 'Request To Call Back', knowMore: 'Know more', sendEmail: 'Send Email', sendSms: 'Send SMS', callMeFree: 'Call Me Free' },
};

const brochure = {
  title: 'Sunrise Pharma Equipments Process & Packaging Brochure',
  pdf: company.brochurePdf,
  pages: 8,
  cover: { heading: 'SUNRISE PHARMA EQUIPMENTS', subheading: 'Manufacturer & Exporter of Pharmaceuticals Machineries', focus: 'Process & Packaging for Liquid & Ointment' },
  packagingLine: bp[4].packagingLineOverview.map((s) => s.replace(/\b\w+/g, (w) => (w === '&' ? w : w[0] + w.slice(1).toLowerCase()))).map((s) => s.replace('Airjet', 'Airjet')),
  machineIds: brochureMachines.map((m) => m.id),
  pageImages: Array.from({ length: 8 }, (_, i) => `/assets/brochure/pages/page-${i + 1}.jpg`),
  wordCloud: bp[7].wordCloud,
  designCredit: 'Creatshal Design | +91 92655 26521',
};

// Specification/trade-info fields common to every product → expose once, so pages can show "standard terms".
const commonTrade = {};
for (const key of Object.keys(products[0].tradeInformation)) {
  const vals = new Set(products.map((p) => p.tradeInformation[key]));
  if (vals.size === 1 && !vals.has(undefined)) commonTrade[key] = [...vals][0];
}

// Every file under public/assets, grouped by folder (product photos are already on each product).
const assets = {};
for (const group of ['logo', 'banners', 'company', 'icons']) {
  const dir = path.join(publicDir, 'assets', 'images', group);
  assets[group] = fs.existsSync(dir) ? fs.readdirSync(dir).sort().map((f) => `/assets/images/${group}/${f}`) : [];
}
assets.brochure = company.brochurePdf;

// ---------------------------------------------------------------- sanity checks

const problems = [];
for (const p of products) {
  if (!p.price) problems.push(`${p.id} has no price`);
  if (!p.image) problems.push(`${p.id} has no image`);
  for (const g of p.gallery) if (!fs.existsSync(path.join(publicDir, g))) problems.push(`${p.id}: missing file public${g}`);
  if (!Object.keys(p.specifications).length) problems.push(`${p.id} has no specifications`);
  if (!p.description) problems.push(`${p.id} has no description`);
}
for (const b of heroBanners) if (!fs.existsSync(path.join(publicDir, b.image))) problems.push(`missing banner ${b.image}`);
for (const c of categories) if (!c.productIds.length) problems.push(`category ${c.id} is empty`);
if (products.length !== 26) problems.push(`expected 26 products, got ${products.length}`);
if (problems.length) {
  console.error('Problems:\n  ' + problems.join('\n  '));
  process.exitCode = 1;
}

// ---------------------------------------------------------------- write

const strip = (o) => JSON.parse(JSON.stringify(o)); // drops undefined keys
const j = (o) => JSON.stringify(strip(o), null, 2);

const out = `/**
 * Sunrise Pharma Equipments — single source of truth for all site content.
 *
 * GENERATED by raw-data/build_sunrise_data.mjs from the scraped website HTML
 * (raw-data/raw_html) and the 8-page brochure PDF. Edit the generator, not this file,
 * if you need to re-import; hand edits are fine if you no longer plan to regenerate.
 *
 * Everything is stored once and linked by id:
 *   company            name, contact, addresses, legal ids, key facts, social links
 *   categories[]       6 categories; productIds[] + brochureMachineIds[] point into the lists below
 *   products[]         26 products; categoryId, relatedProductIds[] link back
 *   brochureMachines[] 10 machines described in the brochure (features, process equipment)
 *   brochure           brochure metadata + packaging line + word cloud
 *   pages              page-specific copy + SEO; lists hold ids, not copies
 *   navigation, forms  menus, redirects, form fields, CTA labels
 *   assets             logo / banner / company / icon image paths under public/
 *   standardTradeTerms trade terms shared by every product
 *
 * Helpers at the bottom resolve the ids (getProduct, getCategory, getProductsByCategory, ...).
 */

export const company = ${j(company)};

export const categories = ${j(categories)};

export const products = ${j(products)};

export const brochureMachines = ${j(brochureMachines)};

export const brochure = ${j(brochure)};

export const standardTradeTerms = ${j(commonTrade)};

export const pages = ${j(pages)};

export const navigation = ${j(navigation)};

export const forms = ${j(forms)};

export const assets = ${j(assets)};

// ---------------------------------------------------------------- lookups

const productById = new Map(products.map((p) => [p.id, p]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const categoryById = new Map(categories.map((c) => [c.id, c]));
const machineById = new Map(brochureMachines.map((m) => [m.id, m]));

/** Find a product by id ("10543092"), slug, or old site URL ("/cosmetic-manufacturing-plant-10543087.html"). */
export function getProduct(key) {
  if (!key) return null;
  const k = String(key).replace(/^\\//, '').replace(/\\.html$/, '');
  return productById.get(k) || productBySlug.get(k) || productById.get((k.match(/(\\d{8})$/) || [])[1]) || null;
}

/** Find a category by id or old site URL ("/vacuum-tray-dryer.html"). */
export function getCategory(key) {
  if (!key) return null;
  const k = String(key).replace(/^\\//, '');
  return categoryById.get(k.replace(/\\.html$/, '')) || categories.find((c) => c.liveUrl === '/' + k) || null;
}

export const getProductsByCategory = (categoryId) => (getCategory(categoryId)?.productIds || []).map((id) => productById.get(id));
export const getCategoryOf = (product) => categoryById.get((typeof product === 'string' ? getProduct(product) : product)?.categoryId) || null;
export const getBrochureMachine = (id) => machineById.get(id) || null;
export const getBrochureMachinesForCategory = (categoryId) => (getCategory(categoryId)?.brochureMachineIds || []).map((id) => machineById.get(id));

/** Related products: the site's own "More Products" list, topped up from the same category. */
export function getRelatedProducts(productOrId, limit = 4) {
  const p = typeof productOrId === 'string' ? getProduct(productOrId) : productOrId;
  if (!p) return [];
  const ids = [...p.relatedProductIds, ...getCategory(p.categoryId).productIds].filter((id, i, a) => id !== p.id && a.indexOf(id) === i);
  return ids.slice(0, limit).map((id) => productById.get(id));
}

/** Resolve a list of ids (e.g. pages.home.popularProducts.productIds). */
export const resolveProducts = (ids) => ids.map((id) => productById.get(id)).filter(Boolean);
export const resolveCategories = (ids) => ids.map((id) => categoryById.get(id)).filter(Boolean);

/** Simple case-insensitive search across names, category, specs and description. */
export function searchProducts(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, categoryById.get(p.categoryId).name, p.description, ...Object.values(p.specifications)].join(' ').toLowerCase().includes(q),
  );
}

export const formatPrice = (price) => (price ? price.display : 'Price on request');

const sunriseData = { company, categories, products, brochureMachines, brochure, standardTradeTerms, pages, navigation, forms, assets };
export default sunriseData;
`;

fs.writeFileSync(outFile, out);
console.log(`Wrote ${path.relative(process.cwd(), outFile)} (${(out.length / 1024).toFixed(0)} KB): ${products.length} products, ${categories.length} categories, ${brochureMachines.length} brochure machines.`);
