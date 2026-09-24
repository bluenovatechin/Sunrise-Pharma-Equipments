import { useParams } from 'react-router-dom';
import { brochureMachines, getBrochureMachine, getCategory, getProductsByCategory } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema } from '../seo/schema';
import { MachineCard, ProductCard } from '../components/cards';
import { CheckList, CtaBand, LinkArrow, PageHero, SectionHead, Steps } from '../components/ui';
import { inr } from '../site';
import NotFoundPage from './NotFoundPage';

export default function SolutionPage() {
  const { machineId } = useParams();
  const m = getBrochureMachine(machineId);
  if (!m) return <NotFoundPage />;

  const cat = m.categoryId && getCategory(m.categoryId);
  const models = cat ? getProductsByCategory(cat.id) : [];
  const siblings = brochureMachines.filter((x) => x.line === m.line && x.id !== m.id);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Solutions', to: '/solutions' }, { label: m.name, to: m.path }];
  const equipment = m.processEquipments;
  const figure = m.capacity || m.modelRange || m.availableCapacitiesText;

  return (
    <>
      <Seo
        title={`${m.name} — Features & Process Equipment`}
        description={`${m.summary} ${cat ? `${models.length} models from ${inr(cat.priceFrom)}.` : 'Available on request.'} Sunrise Pharma Equipments, Ahmedabad.`}
        path={m.path}
        image={m.image}
        jsonLd={breadcrumbSchema(crumbs)}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={m.line === 'process' ? 'Process Solution' : 'Packaging Solution'}
        title={m.name}
        lead={m.description || m.summary}
        image={m.image}
        chips={[figure, cat && `${models.length} models from ${inr(cat.priceFrom)}`, 'Stainless steel'].filter(Boolean)}
      />

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="Key features" title="Key features, products & services" lead="Comprehensive engineering specifications, features and performance standards." />
            <CheckList items={m.keyFeatures} />
          </div>
          <div className="stack">
            {figure && (
              <div className="card card-soft">
                <div className="eyebrow">{m.modelRange ? 'Model range' : 'Capacity'}</div>
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>{figure}</h3>
              </div>
            )}
            {Array.isArray(equipment) && (
              <div className="card">
                <h3>Process equipment</h3>
                <CheckList cols items={equipment} />
              </div>
            )}
            {equipment && !Array.isArray(equipment) && Object.entries(equipment).map(([vessel, items]) => (
              <div key={vessel} className="card">
                <h3>{vessel}</h3>
                <CheckList items={items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {cat && (
        <section className="section section--soft">
          <div className="container">
            <div className="split" style={{ alignItems: 'start', marginBottom: 56 }}>
              <SectionHead eyebrow="How it works" title={`How the ${m.name.toLowerCase()} works`} lead={cat.guide.whatItIs} />
              <Steps steps={cat.guide.steps} />
            </div>
            <div className="section-head-row">
              <SectionHead eyebrow="Buy" title={`${cat.name} models`} lead="Standard models with prices and full specifications." />
              <LinkArrow to={cat.path}>Compare all models</LinkArrow>
            </div>
            <div className="grid grid-4">
              {models.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} showCategory={false} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <CtaBand title={`Get a quote for a ${m.name.toLowerCase()}`} product={m.name} />
          <div style={{ marginTop: 64 }}>
            <SectionHead eyebrow={m.line === 'process' ? 'Process Solutions' : 'Packaging Solutions'} title="Other machines in this line" />
            <div className="grid grid-2">
              {siblings.map((s) => <MachineCard key={s.id} machine={s} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
