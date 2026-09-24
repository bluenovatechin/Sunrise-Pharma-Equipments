import { Link, useParams } from 'react-router-dom';
import { categories, getCategory, getProductsByCategory, getBrochureMachinesForCategory } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, itemListSchema } from '../seo/schema';
import { CategoryCard, ProductCard } from '../components/cards';
import { CheckList, CtaBand, FaqList, LinkArrow, PageHero, SectionHead, Steps } from '../components/ui';
import { displayValue, inr } from '../site';
import NotFoundPage from './NotFoundPage';

/** Unique product FAQs for a range (many products share near-identical questions). */
function rangeFaqs(items, limit = 8) {
  const seen = new Set();
  const out = [];
  for (const p of items) {
    for (const f of p.faqs) {
      const key = f.question.toLowerCase().replace(/[^a-z]/g, '').replace(/(this|the|these|plant|plants|machine|dryer|product)/g, '');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...f, from: p });
    }
  }
  return out.slice(0, limit);
}

/** Spec rows for the comparison table: every spec that at least half the models list. */
function compareRows(items) {
  const count = {};
  for (const p of items) for (const k of Object.keys(p.specifications)) count[k] = (count[k] || 0) + 1;
  return Object.keys(count).filter((k) => count[k] >= Math.ceil(items.length / 2) && k !== 'Color').sort((a, b) => count[b] - count[a]);
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const c = getCategory(categoryId);
  if (!c) return <NotFoundPage />;

  const items = getProductsByCategory(c.id);
  const machines = getBrochureMachinesForCategory(c.id);
  const faqs = rangeFaqs(items);
  const rows = compareRows(items);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: c.name, to: c.path }];
  const others = categories.filter((x) => x.id !== c.id);

  return (
    <>
      <Seo
        title={`${c.name} Manufacturer & Exporter — ${items.length} Models, Prices`}
        description={`${c.guide.whatItIs.split('. ')[0]}. Compare ${items.length} ${c.name.toLowerCase()} models from ${inr(c.priceFrom)} — made in Ahmedabad, India.`}
        path={c.path}
        image={c.image}
        jsonLd={[breadcrumbSchema(crumbs), itemListSchema(items)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={c.guide.tagline}
        title={c.name}
        lead={c.guide.whatItIs}
        image={c.image}
        chips={[`${items.length} ${items.length === 1 ? 'model' : 'models'}`, `From ${inr(c.priceFrom)}`, 'MOQ 1 unit', 'Made in Ahmedabad']}
      />

      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <a href="#models">Models</a>
          <a href="#how-it-works">How it works</a>
          {items.length > 1 && <a href="#compare">Compare</a>}
          <a href="#buying-guide">Buying guide</a>
          {faqs.length > 0 && <a href="#faq">FAQ</a>}
        </div>
      </nav>

      <section className="section" id="models">
        <div className="container">
          <SectionHead eyebrow="Models" title={`${c.name} models`} lead={c.description} />
          <div className="grid grid-4">
            {items.map((p) => <ProductCard key={p.id} product={p} showCategory={false} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="how-it-works">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div>
              <SectionHead eyebrow="How it works" title={`How a ${c.name.replace(/^Automatic /, '').toLowerCase()} works`} lead={c.guide.whatItIs} />
              <h3 style={{ marginTop: 8 }}>Where it is used</h3>
              <div className="chip-list" style={{ marginTop: 12 }}>
                {c.guide.applications.map((a) => <span key={a} className="chip chip-brand">{a}</span>)}
              </div>
              {machines[0] && (
                <div className="media-contain" style={{ marginTop: 28 }}>
                  <img src={machines[0].image} alt={machines[0].name} loading="lazy" />
                </div>
              )}
            </div>
            <Steps steps={c.guide.steps} />
          </div>
        </div>
      </section>

      {items.length > 1 && (
        <section className="section" id="compare">
          <div className="container">
            <SectionHead eyebrow="Compare" title="Side-by-side comparison" lead="Key specifications of every model in this range. Scroll sideways on small screens." />
            <div className="table-scroll">
              <table className="compare">
                <thead>
                  <tr>
                    <th scope="col">Model</th>
                    {items.map((p) => <th key={p.id} scope="col"><Link to={p.path}>{p.name}</Link></th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Indicative price</th>
                    {items.map((p) => <td key={p.id}><strong>{p.price ? inr(p.price.amount) : 'On request'}</strong></td>)}
                  </tr>
                  {rows.map((k) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      {items.map((p) => <td key={p.id}>{displayValue(k, p.specifications[k]) || '—'}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Delivery time</th>
                    {items.map((p) => <td key={p.id}>{displayValue('Delivery', p.tradeInformation['Delivery Time']) || '—'}</td>)}
                  </tr>
                  <tr>
                    <th scope="row">Supply ability</th>
                    {items.map((p) => <td key={p.id}>{p.tradeInformation['Supply Ability'] || '—'}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className={`section${items.length > 1 ? ' section--soft' : ''}`} id="buying-guide">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="Buying guide" title="What to decide before you order" lead="Have these answers ready and we can quote the right configuration first time." />
            <CheckList items={c.guide.buyingTips} />
          </div>
          {machines.map((m) => (
            <div key={m.id} className="card">
              <div className="eyebrow">Technical Overview</div>
              <h3>{m.name} — key features</h3>
              <CheckList items={m.keyFeatures.slice(0, 7)} />
              <div style={{ marginTop: 18 }}><LinkArrow to={m.path}>All features &amp; process equipment</LinkArrow></div>
            </div>
          ))}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section" id="faq">
          <div className="container split" style={{ alignItems: 'start' }}>
            <SectionHead eyebrow="FAQ" title={`${c.name} — common questions`} lead="Answers come from the individual model pages — specifications differ between models." />
            <FaqList faqs={faqs} />
          </div>
        </section>
      )}

      <section className="section section--soft">
        <div className="container">
          <CtaBand title={`Need a ${c.name.toLowerCase()}?`} text="Send us your product, batch size and output. We will recommend the right model and send a quotation." product={c.name} />
          <div style={{ marginTop: 64 }}>
            <SectionHead eyebrow="Explore more" title="Other machine ranges" />
            <div className="grid grid-3">
              {others.slice(0, 3).map((o) => <CategoryCard key={o.id} category={o} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
