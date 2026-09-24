import { Link } from 'react-router-dom';
import { brochureMachines, categories, getProductsByCategory } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema } from '../seo/schema';
import { PageHero } from '../components/ui';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Sitemap', to: '/sitemap' }];

export default function SitemapPage() {
  return (
    <>
      <Seo title="Sitemap" description="Every page on the Sunrise Pharma Equipments website: products, solutions, company information and contact." path="/sitemap" jsonLd={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Sitemap" title="All pages" />
      <section className="section">
        <div className="container sitemap-cols">
          <section>
            <h2 style={{ fontSize: '1.2rem' }}>Company</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </section>
          <section>
            <h2 style={{ fontSize: '1.2rem' }}><Link to="/solutions">Solutions</Link></h2>
            <ul>{brochureMachines.map((m) => <li key={m.id}><Link to={m.path}>{m.name}</Link></li>)}</ul>
          </section>
          {categories.map((c) => (
            <section key={c.id}>
              <h2 style={{ fontSize: '1.2rem' }}><Link to={c.path}>{c.name}</Link></h2>
              <ul>{getProductsByCategory(c.id).map((p) => <li key={p.id}><Link to={p.path}>{p.name}</Link></li>)}</ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
