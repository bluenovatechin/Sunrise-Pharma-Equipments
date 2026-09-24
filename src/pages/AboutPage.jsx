import { company, pages, products } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema } from '../seo/schema';
import { CheckList, CtaBand, PageHero, SectionHead } from '../components/ui';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'About Us', to: '/about' }];

const GALLERY = [
  ['/assets/images/company/company-about.jpg', 'Process vessels under fabrication'],
  ['/assets/images/products/vacuum-tray-dryer/gallery-extra-vtd-1.jpeg', 'Vacuum tray dryer with condenser'],
  ['/assets/images/products/ointment-manufacturing-plant/pharmaceutical-ointment-manufacturing-plant.jpeg', 'Ointment manufacturing plant'],
  ['/assets/images/products/vacuum-tray-dryer/automatic-ss-vacuum-tray-dryer.jpeg', 'Automatic SS vacuum tray dryer'],
  ['/assets/images/products/ointment-manufacturing-plant/gallery-extra-ointment-plant.jpeg', 'Ointment plant vessels & platform'],
  ['/assets/images/company/about-intro-feature.jpg', 'Vacuum tray dryer at our works'],
];

export default function AboutPage() {
  const profile = pages.companyProfile;
  const section = (id) => profile.sections.find((s) => s.id === id);
  const team = section('team');
  const why = section('why-us');
  const infra = section('infrastructure');
  const facts = company.keyFacts.filter((f) => !f.highlight || f.label !== 'Import Percentage');

  return (
    <>
      <Seo
        title="About Us — Pharma Machinery Manufacturer in Ahmedabad since 2019"
        description={`${company.name} was founded in ${company.yearOfEstablishment} in Ahmedabad, Gujarat. We manufacture and export ointment plants, syrup plants, vacuum tray dryers and packaging machines. GST ${company.legal.gstNumber}.`}
        path="/about"
        image="/assets/images/company/company-about.jpg"
        jsonLd={breadcrumbSchema(crumbs)}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="About us"
        title="Precision process & packaging machinery, built in Ahmedabad"
        lead={profile.intro[0]}
        chips={[`Founded ${company.yearOfEstablishment}`, `${company.numberOfEmployees} people`, company.natureOfBusiness.join(' · '), 'Vatva GIDC, Ahmedabad']}
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead eyebrow="Who we are" title="Dependable machinery for pharma & cosmetic makers" />
            {pages.companyInformation.paragraphs.map((p) => <p key={p} className="lead" style={{ fontSize: '1.05rem' }}>{p}</p>)}
            <div className="quote" style={{ marginTop: 24 }}>{profile.intro[1]}</div>
          </div>
          <div className="media-frame" style={{ aspectRatio: '1000 / 565' }}>
            <img src="/assets/images/company/company-about.jpg" alt="Stainless steel vessels at the Sunrise Pharma Equipments works" width="1000" height="565" />
          </div>
        </div>
      </section>

      <section className="section-sm section--dark">
        <div className="container">
          <div className="stats" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
            <div className="stat"><strong style={{ color: '#fff' }}>{company.yearOfEstablishment}</strong><span style={{ color: '#a9b8c7' }}>Year established</span></div>
            <div className="stat"><strong style={{ color: '#fff' }}>{company.numberOfEmployees}</strong><span style={{ color: '#a9b8c7' }}>Team members</span></div>
            <div className="stat"><strong style={{ color: '#fff' }}>{products.length}</strong><span style={{ color: '#a9b8c7' }}>Machine models</span></div>
            <div className="stat"><strong style={{ color: '#fff' }}>{company.logistics.exportMarkets.length}</strong><span style={{ color: '#a9b8c7' }}>Export regions</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow={team.title} title="A skilled team of professionals" />
            {team.paragraphs.map((p) => <p key={p} className="muted">{p}</p>)}
          </div>
          <div className="card card-soft">
            <h3>{team.listTitle.replace(':', '')}</h3>
            <CheckList items={team.list} />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3>{why.listTitle.replace(':', '')}</h3>
            <CheckList items={why.list} />
          </div>
          <div>
            <SectionHead eyebrow={why.title.replace('?', '')} title="Why customers choose us" />
            {why.paragraphs.map((p) => <p key={p} className="muted">{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead eyebrow={infra.title} title="State-of-the-art production units" />
            {infra.paragraphs.map((p) => <p key={p} className="muted">{p}</p>)}
          </div>
          <div className="media-frame" style={{ aspectRatio: '505 / 410' }}>
            <img src="/assets/images/company/about-intro-feature.jpg" alt="Vacuum tray dryer under construction at our works" width="505" height="410" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Our works" title="Inside the factory" lead="Machines built and assembled at our works in Vatva GIDC, Ahmedabad." />
          <div className="grid grid-3">
            {GALLERY.map(([src, alt]) => (
              <figure key={src} style={{ margin: 0 }}>
                <div className="media-frame" style={{ aspectRatio: '4 / 3' }}><img src={src} alt={alt} loading="lazy" /></div>
                <figcaption className="small muted" style={{ marginTop: 8 }}>{alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="Key facts" title={profile.keyFactsTitle} lead="Our registrations and trade details at a glance." />
            <a href={company.trustBadge.link} target="_blank" rel="noopener noreferrer" className="card card-hover" style={{ display: 'inline-flex', gap: 16, alignItems: 'center' }}>
              <img src={company.trustBadge.image} alt={company.trustBadge.title} width="120" height="48" />
              <span><strong style={{ color: 'var(--ink)', display: 'block' }}>{company.trustBadge.platform}</strong><span className="small muted">Verified {company.trustBadge.title.toLowerCase()}</span></span>
            </a>
          </div>
          <div className="kv">
            {facts.map((f) => <div key={f.label}><span>{f.label}</span><strong>{f.value}</strong></div>)}
            <div><span>Proprietor</span><strong>{company.people[0].name}</strong></div>
            <div><span>Domestic market</span><strong>{company.logistics.domesticMarket}</strong></div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container"><CtaBand title="Let’s build your next line together" /></div>
      </section>
    </>
  );
}
