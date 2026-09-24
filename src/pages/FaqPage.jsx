import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { company, categories, getProductsByCategory } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, faqSchema } from '../seo/schema';
import { CtaBand, FaqList, PageHero, SectionHead } from '../components/ui';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'FAQ', to: '/faq' }];

export default function FaqPage() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions — Prices, Delivery, Export & Customisation"
        description="Answers to common questions about Sunrise Pharma Equipments: machine prices, minimum order, customisation, installation, payment terms, shipping, export and warranty."
        path="/faq"
        jsonLd={[breadcrumbSchema(crumbs), faqSchema(company.faqs)]}
      />
      <PageHero crumbs={crumbs} eyebrow="FAQ" title="Frequently asked questions" lead="Everything buyers usually ask before ordering. Can’t find your answer? Call or message us — we reply quickly." />

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="side-sticky" style={{ top: 'calc(var(--header-h) + 24px)' }}>
            <SectionHead eyebrow="General" title="About ordering from us" lead="Pricing, delivery, payment, export and support." />
            <div className="card card-soft">
              <strong style={{ color: 'var(--ink)' }}>Still have a question?</strong>
              <p className="small muted" style={{ margin: '6px 0 14px' }}>{company.contact.businessHours.display}</p>
              <div className="btn-row">
                <a className="btn btn-primary btn-sm" href={`tel:${company.contact.mobile.tel}`}>Call {company.contact.mobile.display}</a>
                <Link className="btn btn-outline btn-sm" to="/contact">Contact page</Link>
              </div>
            </div>
          </div>
          <FaqList faqs={company.faqs} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Machine questions" title="Questions about a specific machine?" lead="Each product range has its own FAQ covering materials, capacity, voltage, control and warranty." />
          <div className="grid grid-3">
            {categories.map((c) => {
              const count = getProductsByCategory(c.id).reduce((n, p) => n + p.faqs.length, 0);
              return (
                <Link key={c.id} to={`${c.path}#faq`} className="card card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>
                    <strong style={{ color: 'var(--ink)', display: 'block' }}>{c.name}</strong>
                    <span className="small muted">{count ? `${count} answered questions` : 'Specifications & trade terms'}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden style={{ color: 'var(--brand)', flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand /></div>
      </section>
    </>
  );
}
