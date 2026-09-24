import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brochure, brochureMachines } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, itemListSchema } from '../seo/schema';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { asset } from '../site';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Solutions', to: '/solutions' }];

function BigMachineCard({ m }) {
  return (
    <Link to={m.path} className="cat-card card-hover">
      <div className="cat-card-media"><img src={m.image} alt={m.name} loading="lazy" /></div>
      <div className="cat-card-body">
        <h3>{m.name}</h3>
        <p>{m.summary}</p>
        <div className="cat-card-meta">
          <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Explore {m.name}</span>
          <ArrowRight size={18} aria-hidden style={{ color: 'var(--brand)', flexShrink: 0, marginLeft: 8 }} />
        </div>
      </div>
    </Link>
  );
}

export default function SolutionsPage() {
  const process = brochureMachines.filter((m) => m.line === 'process');
  const packaging = brochureMachines.filter((m) => m.line === 'packaging');

  return (
    <>
      <Seo
        title="Process & Packaging Solutions for Liquid & Ointment Manufacturing"
        description="Complete process and packaging lines for liquid oral and ointment products: syrup and ointment plants, vacuum tray dryers, sparkler filter press, bottle unscrambler, air jet cleaning, filling, capping, labelling and inspection machines."
        path="/solutions"
        image="/assets/images/brochure/packaging-line.jpg"
        jsonLd={[breadcrumbSchema(crumbs), itemListSchema(brochureMachines)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Process & packaging"
        title="Complete lines for liquid & ointment products"
        lead="A liquid or ointment facility has two halves: process equipment that makes the product, and a packaging line that fills, caps and labels it. We build both — as a turnkey line or one machine at a time."
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Part 1" title="Process equipment" lead="Plants and machines that prepare, mix, dry and filter your product." />
          <div className="grid grid-4">
            {process.map((m) => <BigMachineCard key={m.id} m={m} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Part 2" title="Bottle packaging line" lead="Empty bottles go in one end; filled, capped, labelled and inspected bottles come out the other." />
          <div className="flow-img">
            <img src={asset('/assets/images/brochure/packaging-line.jpg')} alt="Automatic bottle packaging line" width="793" height="192" loading="lazy" />
          </div>
          <div className="flow" style={{ marginBottom: 48 }}>
            {brochure.packagingLine.map((step, i) => <div key={step} className="flow-step"><b>Step {i + 1}</b>{step}</div>)}
          </div>
          <div className="grid grid-3">
            {packaging.map((m) => <BigMachineCard key={m.id} m={m} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand title="Planning a complete line?" text="Tell us your product and target output. We will design the process, equipment and transfer piping, and support installation and validation." /></div>
      </section>
    </>
  );
}
