import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarClock, Mail, MessageCircle, Phone, ShieldCheck, Truck } from 'lucide-react';
import { company, products, getProduct, getCategoryOf, getRelatedProducts, getBrochureMachinesForCategory } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, faqSchema, productSchema } from '../seo/schema';
import { ProductCard } from '../components/cards';
import { Breadcrumbs, CheckList, CtaBand, FaqList, LinkArrow, SpecTable, Steps } from '../components/ui';
import { useQuote } from '../components/quote-context';
import { displayValue, inr, keySpecs, tidy, whatsappLink } from '../site';
import NotFoundPage from './NotFoundPage';

const HIGHLIGHT_KEYS = [['Capacity', 'Size'], ['Material'], ['Control Mode', 'Automatic Grade'], ['Voltage'], ['Power'], ['Weight (kg)', 'Weight']];

/** A readable intro for every product; built from specs when the source had no prose. */
function introFor(p) {
  if (!p.descriptionSource) return p.description;
  const s = { ...p.detailedSpecifications, ...p.specifications };
  const bits = [
    (s.Capacity || s['Production Capacity']) && `an output of ${s.Capacity || s['Production Capacity']}`,
    s.Material && `${s.Material.toLowerCase()} construction`,
    s['Control Mode'] && `${s['Control Mode'].toLowerCase()} control`,
    s.Voltage && `a ${s.Voltage} supply`,
  ].filter(Boolean);
  return `The ${p.name} is built by ${company.name} in Ahmedabad for pharmaceutical packaging lines, with ${bits.join(', ')}.${p.keyFeatures ? ` Condition: ${p.keyFeatures.Condition}, grade: ${p.keyFeatures.Grade}, quality: ${p.keyFeatures.Quality}.` : ''}`;
}

export default function ProductPage() {
  const { slug } = useParams();
  const p = getProduct(slug);
  const { openQuote } = useQuote();
  const [active, setActive] = useState(0);
  if (!p) return <NotFoundPage />;

  const cat = getCategoryOf(p);
  // Same-range models first; single-model ranges are topped up with other packaging / process machines.
  const related = getRelatedProducts(p, 4);
  if (related.length < 4) {
    const packaging = ['bottle-cap-sealing-machine', 'syrup-bottle-filling-machine', 'sticker-labeling-machine'];
    const sameLine = (x) => packaging.includes(x.categoryId) === packaging.includes(p.categoryId);
    related.push(...products.filter((x) => x.id !== p.id && sameLine(x) && !related.includes(x)).slice(0, 4 - related.length));
  }
  const machine = getBrochureMachinesForCategory(cat.id)[0];
  const intro = introFor(p);
  const specs = { ...p.detailedSpecifications, ...p.specifications };
  const highlights = HIGHLIGHT_KEYS.map((keys) => keys.map((k) => [k.replace(' (kg)', ''), specs[k]]).find(([, v]) => v)).filter(Boolean).slice(0, 6);
  const { 'Main Export Market(s)': markets, ...trade } = p.tradeInformation;
  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: cat.name, to: cat.path },
    { label: p.name, to: p.path },
  ];
  const warranty = displayValue('Warranty', p.specifications.Warranty);
  const delivery = displayValue('Delivery Time', trade['Delivery Time']);
  const waText = `Hello ${company.name}, I am interested in the ${p.name} (${inr(p.price?.amount || 0)}). Please share details and a quotation.`;

  return (
    <>
      <Seo
        title={`${p.name} — Price ${p.price ? inr(p.price.amount) : ''} & Specifications`}
        description={`${intro.slice(0, 150).replace(/\s\S*$/, '')}… ${p.price ? `Price ${inr(p.price.amount)} per ${p.price.unit.toLowerCase()}.` : ''} Manufacturer & exporter, Ahmedabad.`}
        path={p.path}
        image={p.image}
        type="product"
        jsonLd={[productSchema(p), breadcrumbSchema(crumbs), faqSchema(p.faqs)]}
      />

      <div className="container" style={{ paddingTop: 24 }}>
        <Breadcrumbs items={crumbs} light />
        <div className="product-top">
          <div>
            <div className="gallery-main">
              <img src={p.gallery[active]} alt={`${p.name}${active ? ` — photo ${active + 1}` : ''}`} width="800" height="800" fetchPriority="high" />
            </div>
            {p.gallery.length > 1 && (
              <div className="gallery-thumbs">
                {p.gallery.map((src, i) => (
                  <button key={src} type="button" aria-pressed={i === active} aria-label={`Show photo ${i + 1}`} onClick={() => setActive(i)}>
                    <img src={src} alt="" width="76" height="76" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <Link to={cat.path} className="chip chip-brand">{cat.name}</Link>
            <h1>{p.name}</h1>
            <p className="lead" style={{ fontSize: '1.02rem' }}>{intro.split(/(?<=\.)\s/)[0]}</p>

            <div className="price-box">
              <div className="price">
                <small>Indicative price</small>
                {p.price ? `${inr(p.price.amount)} / ${p.price.unit}` : 'Price on request'}
              </div>
              <div className="moq">
                Minimum order
                <strong>{p.moq?.display || '1 Unit'}</strong>
              </div>
            </div>

            <div className="highlights">
              {highlights.map(([k, v]) => (
                <div key={k} className="highlight"><span>{k}</span><strong>{tidy(v)}</strong></div>
              ))}
            </div>

            <div className="btn-row">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => openQuote(p.name)}>Get a quotation</button>
              <a className="btn btn-wa btn-lg" href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden /> WhatsApp</a>
              <a className="btn btn-outline btn-lg" href={`tel:${company.contact.mobile.tel}`}><Phone size={18} aria-hidden /> Call</a>
            </div>

            <div className="assurances">
              <div className="assurance"><ShieldCheck size={18} aria-hidden /> Warranty: {warranty || 'Ask for details'}</div>
              <div className="assurance"><CalendarClock size={18} aria-hidden /> Delivery: {delivery || 'Ask for details'}</div>
              <div className="assurance"><Truck size={18} aria-hidden /> {trade['Supply Ability'] || 'Road, rail & air'}</div>
            </div>
          </div>
        </div>
      </div>

      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <a href="#overview">Overview</a>
          <a href="#specifications">Specifications</a>
          <a href="#trade">Trade terms</a>
          <a href="#how-it-works">How it works</a>
          {p.faqs.length > 0 && <a href="#faq">FAQ</a>}
          {related.length > 0 && <a href="#related">Related</a>}
        </div>
      </nav>

      <div className="container">
        <div className="content-grid">
          <div>
            <section className="content-block" id="overview">
              <h2>Overview</h2>
              <div className="prose">
                {intro.split('\n\n').map((para) => <p key={para}>{para}</p>)}
              </div>
              <div className="chip-list" style={{ marginTop: 8 }}>
                {keySpecs(p).map((s) => <span key={s} className="chip">{s}</span>)}
                {p.specifications['Usage & Applications'] && <span className="chip">For {p.specifications['Usage & Applications'].toLowerCase()}</span>}
              </div>
              {p.keyFeatures && (
                <div style={{ marginTop: 24 }}>
                  <h3>Key features</h3>
                  <CheckList cols items={Object.entries(p.keyFeatures).map(([k, v]) => `${k}: ${v}`)} />
                </div>
              )}
            </section>

            <section className="content-block" id="specifications">
              <h2>Specifications</h2>
              <SpecTable data={p.specifications} caption={`${p.name} specifications`} />
              {p.detailedSpecifications && (
                <>
                  <h3 style={{ marginTop: 28 }}>Additional technical details</h3>
                  <SpecTable data={p.detailedSpecifications} caption="Additional technical details" />
                </>
              )}
            </section>

            <section className="content-block" id="trade">
              <h2>Trade terms &amp; delivery</h2>
              <SpecTable data={trade} caption="Trade information" />
              {markets && (
                <>
                  <h3 style={{ marginTop: 28 }}>Export markets</h3>
                  <div className="chip-list">
                    <span className="chip chip-brand">All India</span>
                    {markets.split(/,\s*/).map((m) => <span key={m} className="chip">{m}</span>)}
                  </div>
                </>
              )}
            </section>

            <section className="content-block" id="how-it-works">
              <h2>How it works</h2>
              <p className="muted">{cat.guide.whatItIs}</p>
              <Steps steps={cat.guide.steps} />
              {machine && (
                <div className="card card-soft" style={{ marginTop: 24 }}>
                  <h3>Equipment highlights: {machine.name}</h3>
                  <CheckList items={machine.keyFeatures.slice(0, 6)} />
                  <div style={{ marginTop: 16 }}><LinkArrow to={machine.path}>See all features</LinkArrow></div>
                </div>
              )}
            </section>

            {p.faqs.length > 0 && (
              <section className="content-block" id="faq">
                <h2>Frequently asked questions</h2>
                <FaqList faqs={p.faqs} />
              </section>
            )}
          </div>

          <aside className="side-sticky" aria-label="Quick contact">
            <div className="card">
              <div className="price" style={{ marginBottom: 14 }}>
                <small>Indicative price</small>
                {p.price ? `${inr(p.price.amount)} / ${p.price.unit}` : 'On request'}
              </div>
              <p className="small muted">The final price depends on capacity, material and automation. Ask us for a quote for your exact configuration.</p>
              <div className="stack" style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-primary btn-block" onClick={() => openQuote(p.name)}>Get a quotation</button>
                <a className="btn btn-wa btn-block" href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden /> Chat on WhatsApp</a>
                <a className="btn btn-outline btn-block" href={`tel:${company.contact.mobile.tel}`}><Phone size={17} aria-hidden /> {company.contact.mobile.display}</a>
                <a className="btn btn-outline btn-block" href={`mailto:${company.contact.email}?subject=${encodeURIComponent(`Inquiry: ${p.name}`)}`}><Mail size={17} aria-hidden /> Email us</a>
              </div>
            </div>
            <Link to={cat.path} className="card card-hover" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <img src={cat.image} alt="" width="72" height="72" style={{ width: 72, height: 72, objectFit: 'contain', mixBlendMode: 'multiply' }} loading="lazy" />
              <span>
                <strong style={{ color: 'var(--ink)', display: 'block' }}>Compare all {cat.productIds.length} models</strong>
                <span className="small muted">{cat.name}</span>
              </span>
            </Link>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--soft" id="related">
          <div className="container">
            <div className="section-head-row">
              <div className="section-head"><div className="eyebrow">You may also need</div><h2>Related machines</h2></div>
              <LinkArrow to={cat.path}>All {cat.name.toLowerCase()} models</LinkArrow>
            </div>
            <div className="grid grid-4">
              {related.map((r) => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container"><CtaBand title={`Interested in the ${p.name}?`} product={p.name} /></div>
      </section>
    </>
  );
}
