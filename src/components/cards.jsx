import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategoryOf, getProduct } from '../data/sunriseData';
import { inr, keySpecs } from '../site';

export function ProductCard({ product, showCategory = true }) {
  const p = typeof product === 'string' ? getProduct(product) : product;
  const cat = getCategoryOf(p);
  return (
    <article className="product-card card-hover">
      <Link to={p.path} className="product-card-media" tabIndex={-1} aria-hidden>
        <img src={p.image} alt="" loading="lazy" width="500" height="500" />
        {showCategory && <span className="chip">{cat.name}</span>}
      </Link>
      <div className="product-card-body">
        <h3><Link to={p.path}>{p.name}</Link></h3>
        <div className="product-card-specs">
          {keySpecs(p).map((s) => <span key={s}>{s}</span>)}
        </div>
        <div className="product-card-foot">
          <div className="price">
            <small>Indicative price</small>
            {p.price ? inr(p.price.amount) : 'On request'}
          </div>
          <Link to={p.path} className="btn btn-outline btn-sm">View details</Link>
        </div>
      </div>
    </article>
  );
}

export function CategoryCard({ category }) {
  const c = category;
  return (
    <Link to={c.path} className="cat-card card-hover">
      <div className="cat-card-media">
        <img src={c.image} alt={c.name} loading="lazy" width="480" height="300" />
      </div>
      <div className="cat-card-body">
        <h3>{c.name}</h3>
        <p>{c.guide.tagline}. {c.shortDescription.split('. ')[0]}.</p>
        <div className="cat-card-meta">
          <span><strong>{c.productIds.length}</strong> {c.productIds.length === 1 ? 'model' : 'models'} · from <strong>{inr(c.priceFrom)}</strong></span>
          <ArrowRight size={18} aria-hidden style={{ color: 'var(--brand)' }} />
        </div>
      </div>
    </Link>
  );
}

export function MachineCard({ machine }) {
  return (
    <Link to={machine.path} className="card card-hover machine-card">
      <img src={machine.image} alt={machine.name} loading="lazy" width="140" height="120" />
      <div>
        <h3>{machine.name}</h3>
        <p>{machine.summary}</p>
        <span className="link-arrow small">Learn more <ArrowRight size={14} aria-hidden /></span>
      </div>
    </Link>
  );
}
