import { Clock, Mail, MapPin, MessageCircle, Phone, User } from 'lucide-react';
import { company } from '../data/sunriseData';
import Seo from '../seo/Seo';
import { breadcrumbSchema, localBusinessSchema } from '../seo/schema';
import InquiryForm from '../components/InquiryForm';
import { PageHero } from '../components/ui';
import { mapsLink, whatsappLink } from '../site';

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact', to: '/contact' }];

function Item({ icon: Icon, title, children }) {
  return (
    <div className="feature">
      <div className="icon-tile"><Icon size={20} aria-hidden /></div>
      <div><h3 style={{ fontSize: '0.98rem' }}>{title}</h3><div className="muted">{children}</div></div>
    </div>
  );
}

export default function ContactPage() {
  const c = company.contact;
  const { office, factory } = company.addresses;
  return (
    <>
      <Seo
        title="Contact Us — Ahmedabad, Gujarat"
        description={`Contact ${company.name}: call ${c.mobile.display}, email ${c.email}. Office: ${office.full}. ${c.businessHours.display}.`}
        path="/contact"
        jsonLd={[breadcrumbSchema(crumbs), localBusinessSchema()]}
      />
      <PageHero crumbs={crumbs} eyebrow="Contact" title="Talk to our team" lead="Share your requirement and we will recommend the right machine and send a quotation — usually within one working day." />

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="stack" style={{ display: 'grid', gap: 26 }}>
            <Item icon={User} title="Contact person">
              <strong style={{ color: 'var(--ink)' }}>{company.people[0].name}</strong> — {company.people[0].role}
            </Item>
            <Item icon={Phone} title="Phone">
              <a href={`tel:${c.mobile.tel}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{c.mobile.display}</a> (mobile)<br />
              <a href={`tel:${c.phone.tel}`}>{c.phone.display}</a> (office)
            </Item>
            <Item icon={MessageCircle} title="WhatsApp">
              <a href={whatsappLink('Hello Sunrise Pharma Equipments, I have an inquiry.')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--wa)', fontWeight: 600 }}>Message us on WhatsApp</a>
            </Item>
            <Item icon={Mail} title="Email">
              <a href={`mailto:${c.email}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{c.email}</a>
            </Item>
            <Item icon={Clock} title="Business hours">{c.businessHours.display}</Item>
            <Item icon={MapPin} title="Office">
              {office.full}<br />
              <a href={mapsLink(office)} target="_blank" rel="noopener noreferrer" className="link-arrow small">Get directions</a>
            </Item>
            <Item icon={MapPin} title="Registered office & factory">
              {factory.full}<br />
              <a href={mapsLink(factory)} target="_blank" rel="noopener noreferrer" className="link-arrow small">Get directions</a>
            </Item>
            <p className="small muted">GST: {company.legal.gstNumber} · IEC: {company.legal.ieCode}</p>
          </div>

          <div className="card" style={{ padding: 28, boxShadow: 'var(--shadow)' }}>
            <div className="eyebrow">Send an inquiry</div>
            <h2 style={{ fontSize: '1.6rem' }}>Tell us about your requirement</h2>
            <p className="muted small">Fields marked * are required.</p>
            <InquiryForm />
          </div>
        </div>
      </section>

      <section className="section-sm section--soft">
        <div className="container">
          <iframe
            className="map-frame"
            title={`Map: ${office.full}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(office.full)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ height: 380 }}
          />
        </div>
      </section>
    </>
  );
}
