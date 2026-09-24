# Sunrise Pharma Equipments — website

Multi-page, SEO-ready website for Sunrise Pharma Equipments (Ahmedabad), built with React + Vite.
Every page is pre-rendered to static HTML at build time, so search engines see full content,
titles, descriptions and structured data on every URL.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (once) |
| `npm run dev` | Local dev server with live reload — http://localhost:5173 |
| `npm run build` | Production build into `dist/` (client build + pre-render of every page) |
| `npm run preview` | Serve the built `dist/` locally to check it |
| `npm run build:data` | Regenerate `src/data/sunriseData.js` from `raw-data/` |
| `npm run lint` | Lint with oxlint |

## Pages (≈50, all pre-rendered)

| URL | Page |
|---|---|
| `/` | Home |
| `/products` | All products, grouped by range, with search |
| `/products/<range>` | One per range (6): models, how it works, comparison table, buying guide, FAQ |
| `/products/<range>/<product>` | One per machine (26): gallery, price, specs, trade terms, FAQ, related |
| `/solutions`, `/solutions/<machine>` | Process & packaging line overview + one page per brochure machine (10) |
| `/about`, `/brochure`, `/faq`, `/contact`, `/sitemap` | Company pages |

The build also writes `sitemap.xml`, `robots.txt`, `404.html`, and redirect pages for every
URL of the old website (e.g. `/vacuum-tray-dryer.html` → `/products/vacuum-tray-dryer`), plus a
`_redirects` file with real 301s for hosts that support it (Netlify, Cloudflare Pages).

## Where things live

```
src/data/sunriseData.js   ALL content: company, categories, products, brochure, FAQs (generated)
src/site.js               Site URL, route list, small helpers (price/unit formatting, WhatsApp link)
src/pages/                One component per page type
src/components/           Layout (header, footer, quote popup), cards, form, shared UI
src/seo/                  <head> tags + JSON-LD structured data
src/styles/global.css     Design system (colours, type, spacing, components)
scripts/prerender.mjs     Renders every route to static HTML after the Vite build
raw-data/                 Source material the data file is generated from
public/assets/            Images, brochure PDF and brochure page previews
```

## Editing content

- **Quick edits:** change `src/data/sunriseData.js` directly (prices, specs, text).
  Note that `npm run build:data` would overwrite hand edits.
- **Re-import from source:** edit `raw-data/build_sunrise_data.mjs` (scraped facts) or
  `raw-data/editorial.mjs` (explanatory copy: "how it works", buying guides, FAQs), then run
  `npm run build:data`.
- **Domain:** canonical URLs and the sitemap use `company.websites.primary`
  (`https://www.sunrisepharmamachine.com`). Change it in `src/site.js` if the site moves.

## Deploying

Upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel/Apache,
nginx, S3). No server or rewrite rules are needed: each page exists as both `page/index.html` and
`page.html`.

## Inquiry form

The site has no backend. The inquiry form opens the visitor's email app (to
`sales.sunrisepharma@gmail.com`) or WhatsApp with the message pre-filled. To receive submissions
directly, connect a form service (e.g. Formspree) in `src/components/InquiryForm.jsx`.
