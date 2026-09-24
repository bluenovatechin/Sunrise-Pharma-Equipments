import { Link } from 'react-router-dom';
import { ArrowRight, Award, Download, Globe2, PackageCheck, Timer, Users, Wrench } from 'lucide-react';
import { company, categories, brochure, brochureMachines, pages, products, resolveProducts, getBrochureMachine } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { itemListSchema } from '../seo/schema';
import { CategoryCard, MachineCard, ProductCard } from '../components/cards';
import { CheckList, CtaBand, FaqList, LinkArrow, SectionHead, Steps } from '../components/ui';
import { useQuote } from '../components/quote-context';
import { firstSentences, asset } from '../site';

const REASONS = [
  { icon: Timer, title: 'Timely delivery', text: 'Clear lead times on every machine and dispatch by road, rail or air.' },
  { icon: Award, title: 'Quality-tested range', text: 'Every machine goes through quality checks at our works before it is dispatched.' },
  { icon: Globe2, title: 'Wide distribution network', text: `Supplying all over India and exporting to ${company.logistics.exportMarkets.length} regions worldwide.` },
  { icon: Users, title: 'Industrial experience', text: 'Engineers, quality analysts and technicians focused on pharma and cosmetic equipment.' },
  { icon: Wrench, title: 'Customisation options', text: 'Plants designed around your product, batch size and level of automation.' },
  { icon: PackageCheck, title: 'Installation support', text: 'An experienced team to support installation and validation at your site.' },
];

export default function HomePage() {
  const { openQuote } = useQuote();
  const popular = resolveProducts(pages.home.popularProducts.productIds);
  const processLine = brochureMachines.filter((m) => m.line === 'process');
  const vtd = getBrochureMachine('vacuum-tray-dryer');

  return (
    <>
      <Seo
        title="Ointment, Syrup Plants & Vacuum Tray Dryer Manufacturer in Ahmedabad"
        description={`${company.name} manufactures ointment manufacturing plants, liquid oral syrup plants, vacuum tray dryers and bottle filling, capping & labelling machines in Ahmedabad, Gujarat. Exporter since ${company.yearOfEstablishment}.`}
        path="/"
        jsonLd={itemListSchema(categories)}
      />

      {/* ---------------------------------------------------------------- hero */}
      <section className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">{company.natureOfBusiness.join(' · ')} · {company.addresses.office.city}, India</div>
            <h1>Process &amp; packaging machinery for <span>liquid &amp; ointment</span> products</h1>
            <p className="lead">
              We design and build ointment plants, syrup plants, vacuum tray dryers and bottle filling, capping and labelling
              machines in stainless steel — for pharmaceutical and cosmetic manufacturers across India and abroad.
            </p>
            <div className="btn-row">
              <Link to="/products" className="btn btn-dark btn-lg">Explore products <ArrowRight size={18} aria-hidden /></Link>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => openQuote()}>Get a free quote</button>
            </div>
            <div className="stats">
              <div className="stat"><strong>{company.yearOfEstablishment}</strong><span>Established</span></div>
              <div className="stat"><strong>{products.length}</strong><span>Machine models</span></div>
              <div className="stat"><strong>{categories.length}</strong><span>Product ranges</span></div>
              <div className="stat"><strong>{company.logistics.exportMarkets.length}</strong><span>Export regions</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <img className="hero-main-img" src={asset('/assets/images/company/company-about.jpg')} alt="Stainless steel process vessels at the Sunrise Pharma Equipments works, Vatva GIDC" width="1000" height="565" fetchPriority="high" />
            <Link to={vtd.path} className="hero-float f1">
              <img src={vtd.image} alt="" width="64" height="64" />
              <span><strong>Vacuum Tray Dryer</strong><span>{vtd.modelRange}</span></span>
            </Link>
            <Link to="/products/ointment-manufacturing-plant" className="hero-float f2">
              <img src={asset('/assets/images/brochure/ointment-manufacturing-plant.jpg')} alt="" width="64" height="64" />
              <span><strong>Ointment plants</strong><span>300–1000 kg batches</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- ranges */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead
              eyebrow="What we make"
              title="Six machine ranges for liquid & ointment production"
              lead="Pick a range to see every model, how the machine works, a side-by-side comparison and prices."
            />
            <LinkArrow to="/products">View all {products.length} machines</LinkArrow>
          </div>
          <div className="grid grid-3">
            {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- lines */}
      <section className="section section--soft">
        <div className="container">
          <SectionHead
            center
            eyebrow="Complete lines"
            title="From raw material to a labelled bottle"
            lead="We supply both halves of a liquid or ointment facility: the process equipment that makes the product, and the packaging line that fills, caps and labels it."
          />
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <h3 style={{ marginBottom: 16 }}>Process equipment</h3>
              <div className="stack">
                {processLine.map((m) => <MachineCard key={m.id} machine={m} />)}
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: 16 }}>Bottle packaging line</h3>
              <div className="flow-img">
                <img src={asset('/assets/images/brochure/packaging-line.jpg')} alt="Automatic bottle packaging line: unscrambler, air jet cleaning, liquid filling, capping, labelling and shrink wrap" width="793" height="192" loading="lazy" />
              </div>
              <div className="flow cols-3">
                {brochure.packagingLine.map((step, i) => (
                  <div key={step} className="flow-step"><b>Step {i + 1}</b>{step}</div>
                ))}
              </div>
              <p className="muted" style={{ marginTop: 18 }}>
                Every station is built in stainless steel to cGMP design, most with PLC &amp; touch-screen control. Buy a complete line or a single machine.
              </p>
              <LinkArrow to="/solutions">See every process &amp; packaging machine</LinkArrow>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- popular */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead eyebrow="Most popular" title="Machines our customers ask about most" />
            <LinkArrow to="/products">Browse all products</LinkArrow>
          </div>
          <div className="grid grid-4">
            {popular.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- why + how */}
      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="Why Sunrise" title="A partner that builds, delivers and supports" lead={firstSentences(pages.companyProfile.sections.find((s) => s.id === 'why-us').paragraphs[0], 2)} />
          <div className="grid grid-3">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="feature">
                <div className="icon-tile"><Icon size={22} aria-hidden /></div>
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 72 }}>
            <SectionHead eyebrow="How we work" title="Four steps from inquiry to installation" />
            <Steps steps={company.howWeWork} cols />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- about */}
      <section className="section">
        <div className="container split">
          <div className="media-frame" style={{ aspectRatio: '505 / 410' }}>
            <img src={asset('/assets/images/company/about-intro-feature.jpg')} alt="Vacuum tray dryer being built at the Sunrise Pharma Equipments works" width="505" height="410" loading="lazy" />
          </div>
          <div>
            <SectionHead eyebrow="About us" title={`${company.name}, Ahmedabad`} />
            <p className="lead" style={{ marginTop: -20 }}>{pages.companyInformation.paragraphs[0]}</p>
            <div className="kv" style={{ margin: '24px 0' }}>
              <div><span>Established</span><strong>{company.yearOfEstablishment}</strong></div>
              <div><span>Team</span><strong>{company.numberOfEmployees} people</strong></div>
              <div><span>Business</span><strong>{company.natureOfBusiness.join(', ')}</strong></div>
              <div><span>Works</span><strong>Vatva GIDC, Ahmedabad</strong></div>
            </div>
            <LinkArrow to="/about">Read our story</LinkArrow>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- markets */}
      <section className="section-sm section--dark">
        <div className="container split">
          <div>
            <div className="eyebrow">Where we deliver</div>
            <h2>All India, and exported worldwide</h2>
            <p className="lead">Machines are dispatched by road, rail and air. We are a registered exporter (IEC {company.legal.ieCode}).</p>
          </div>
          <div className="markets">
            <span>All India</span>
            {company.logistics.exportMarkets.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- brochure */}
      <section className="section section--soft" id="brochure">
        <div className="container split" style={{ alignItems: 'center' }}>
          <div>
            <SectionHead
              eyebrow="Product Catalogue"
              title="Download our official product brochure"
              lead="Explore our complete line of pharmaceutical and cosmetic machinery. Get detailed technical specifications, machine features, and turnkey packaging line layouts in a single PDF."
            />
            <div style={{ margin: '20px 0 28px' }}>
              <CheckList
                items={[
                  'Ointment & liquid oral manufacturing plants',
                  'Vacuum tray dryers & sparkler filter presses',
                  'Automatic bottle packaging lines (unscrambler to labelling)',
                  'Capacities, material grades & automation options',
                ]}
              />
            </div>
            <div className="btn-row">
              <a
                href={company.brochurePdf}
                className="btn btn-primary btn-lg"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download size={18} aria-hidden /> Download Brochure (PDF)
              </a>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => openQuote('Product Brochure')}
              >
                Request Detailed Quote
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              href={company.brochurePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover"
              style={{
                display: 'block',
                padding: 16,
                maxWidth: 320,
                textAlign: 'center',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--line)',
                textDecoration: 'none',
              }}
              title="Download Sunrise Pharma Equipments Brochure"
            >
              <img
                src={asset('/assets/brochure/pages/page-1.jpg')}
                alt="Sunrise Pharma Equipments Process & Packaging Machinery Brochure"
                width="280"
                height="396"
                loading="lazy"
                style={{ borderRadius: 6, border: '1px solid var(--line)', width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ marginTop: 14 }}>
                <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '1.05rem' }}>Process &amp; Packaging Catalogue</strong>
                <span className="small muted" style={{ display: 'block', marginTop: 2 }}>Sunrise Pharma Equipments</span>
                <span className="link-arrow small" style={{ display: 'inline-flex', marginTop: 8 }}>
                  <Download size={14} aria-hidden style={{ marginRight: 4 }} /> Download PDF (3.2 MB)
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- faq + cta */}
      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="FAQ" title="Questions buyers ask us" lead="Straight answers about pricing, customisation, delivery and export." />
            <LinkArrow to="/faq">See all questions</LinkArrow>
          </div>
          <FaqList faqs={company.faqs.slice(3, 8)} />
        </div>
        <div className="container" style={{ marginTop: 80 }}>
          <CtaBand />
        </div>
      </section>
    </>
  );
}
