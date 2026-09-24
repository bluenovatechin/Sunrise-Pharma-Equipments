import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { categories, products, getProductsByCategory, searchProducts } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, itemListSchema } from '../seo/schema';
import { ProductCard } from '../components/cards';
import { CtaBand, LinkArrow, PageHero } from '../components/ui';
import { inr } from '../site';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }];

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => (query.trim() ? new Set(searchProducts(query).map((p) => p.id)) : null), [query]);
  const visible = (id) => !matches || matches.has(id);
  const total = matches ? matches.size : products.length;

  return (
    <>
      <Seo
        title="Pharmaceutical Machinery — All Products & Prices"
        description={`Browse all ${products.length} machines from Sunrise Pharma Equipments: ointment plants, liquid oral syrup plants, vacuum tray dryers, capping, filling and labelling machines — with specifications and prices.`}
        path="/products"
        jsonLd={[breadcrumbSchema(crumbs), itemListSchema(products)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Our products"
        title="Pharmaceutical & cosmetic machinery"
        lead={`${products.length} machines across ${categories.length} ranges — every model with full specifications, trade terms and an indicative price.`}
      />

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <label className="search-input">
              <span className="sr-only">Search machines</span>
              <Search size={18} aria-hidden />
              <input type="search" placeholder="Search by name, capacity, material…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <div className="chip-list">
              {categories.map((c) => <a key={c.id} href={`#${c.id}`} className="chip">{c.name}</a>)}
            </div>
          </div>
          {matches && <p className="muted" aria-live="polite">{total} {total === 1 ? 'machine matches' : 'machines match'} “{query}”.</p>}

          {categories.map((c) => {
            const items = getProductsByCategory(c.id).filter((p) => visible(p.id));
            if (!items.length) return null;
            return (
              <section key={c.id} id={c.id} className="cat-section" aria-labelledby={`${c.id}-title`}>
                <div className="section-head-row">
                  <div className="section-head">
                    <div className="eyebrow">{c.guide.tagline}</div>
                    <h2 id={`${c.id}-title`}><Link to={c.path}>{c.name}</Link></h2>
                    <p className="lead">{c.shortDescription}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="muted small" style={{ marginBottom: 6 }}>{c.productIds.length} models · from {inr(c.priceFrom)}</p>
                    <LinkArrow to={c.path}>Range overview &amp; comparison</LinkArrow>
                  </div>
                </div>
                <div className="grid grid-4">
                  {items.map((p) => <ProductCard key={p.id} product={p} showCategory={false} />)}
                </div>
              </section>
            );
          })}
          {matches && total === 0 && (
            <div className="empty">
              <h3>No machines match “{query}”</h3>
              <p>Try a shorter word like “dryer”, “SS316” or “filling” — or tell us what you need and we will advise.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container"><CtaBand title="Can’t find the exact machine?" text="Customisation is one of our strengths. Share your product, batch size and output and we will configure a machine for you." /></div>
      </section>
    </>
  );
}
