import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Home } from 'lucide-react';
import { displayValue } from '../site';
import { useQuote } from './quote-context';

export function Breadcrumbs({ items, light = false }) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs${light ? ' light' : ''}`}>
      {items.map((it, i) => (
        <span key={it.to} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight size={14} aria-hidden />}
          {i === items.length - 1 ? (
            <span aria-current="page">{it.label}</span>
          ) : (
            <Link to={it.to} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {i === 0 && <Home size={14} aria-hidden />}
              {it.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Dark banner at the top of inner pages. */
export function PageHero({ crumbs, eyebrow, title, lead, image, imageAlt, chips, children }) {
  return (
    <header className="page-hero">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className={image ? 'page-hero-grid' : undefined}>
          <div>
            {eyebrow && <div className="eyebrow" style={{ marginTop: 28, marginBottom: 0 }}>{eyebrow}</div>}
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {chips?.length > 0 && (
              <div className="chip-list">
                {chips.map((c) => <span key={c} className="chip chip-dark">{c}</span>)}
              </div>
            )}
            {children}
          </div>
          {image && (
            <div className="page-hero-media">
              <img src={image} alt={imageAlt || title} width="520" height="390" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, lead, center = false, as: H = 'h2' }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <H>{title}</H>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function CheckList({ items, cols = false }) {
  return (
    <ul className={`check-list${cols ? ' cols' : ''}`}>
      {[...new Set(items)].map((it) => (
        <li key={it}><CheckCircle2 size={18} aria-hidden /><span>{it}</span></li>
      ))}
    </ul>
  );
}

export function SpecTable({ data, caption }) {
  const rows = Object.entries(data || {}).map(([k, v]) => [k, displayValue(k, v)]).filter(([, v]) => v);
  if (!rows.length) return null;
  return (
    <table className="spec-table">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.question} open={i === 0}>
          <summary>{f.question}</summary>
          <p>{f.answer}{f.from && <><br /><Link to={f.from.path} className="small" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>From: {f.from.name} →</Link></>}</p>
        </details>
      ))}
    </div>
  );
}

export function Steps({ steps, cols = false }) {
  return (
    <ol className={`steps${cols ? ' cols' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {steps.map((s) => (
        <li key={s.title} className="step">
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({ title = 'Planning a new line or upgrading one?', text = 'Tell us your product, batch size and output. We will recommend the right machine and send a quotation.', product }) {
  const { openQuote } = useQuote();
  return (
    <div className="cta-band">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => openQuote(product)}>
          Get a quotation <ArrowRight size={18} aria-hidden />
        </button>
        <Link to="/contact" className="btn btn-ghost-light btn-lg">Contact us</Link>
      </div>
    </div>
  );
}

export function LinkArrow({ to, children }) {
  return (
    <Link to={to} className="link-arrow">
      {children} <ArrowRight size={16} aria-hidden />
    </Link>
  );
}
