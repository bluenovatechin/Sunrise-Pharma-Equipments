import { company, getCategoryOf } from '../data/sunriseData';
import { SITE_URL } from '../site';

const abs = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const cleanBase = base.replace(/\/$/, '');
  let p = path;
  if (cleanBase && p.startsWith(cleanBase)) {
    p = p.slice(cleanBase.length);
  }
  return SITE_URL + (p.startsWith('/') ? p : '/' + p);
};

export function organizationSchema() {
  const a = company.addresses.office;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': abs('/#organization'),
    name: company.name,
    alternateName: company.shortName,
    url: abs('/'),
    logo: abs(company.logo.src),
    email: company.contact.email,
    telephone: company.contact.mobile.tel,
    foundingDate: String(company.yearOfEstablishment),
    numberOfEmployees: company.numberOfEmployees,
    taxID: company.legal.gstNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.line1,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode,
      addressCountry: 'IN',
    },
    sameAs: [company.social.facebook, company.social.youtube, company.social.tradeIndiaTrustStamp].filter(Boolean),
  };
}

export function localBusinessSchema() {
  const a = company.addresses.office;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    image: abs('/assets/images/company/company-about.jpg'),
    url: abs('/contact'),
    telephone: company.contact.mobile.tel,
    email: company.contact.email,
    address: { '@type': 'PostalAddress', streetAddress: a.line1, addressLocality: a.city, addressRegion: a.state, postalCode: a.postalCode, addressCountry: 'IN' },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: company.contact.businessHours.open,
      closes: company.contact.businessHours.close,
    }],
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: abs(it.to) })),
  };
}

export function faqSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}

export function productSchema(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.gallery.map(abs),
    sku: p.id,
    category: getCategoryOf(p)?.name,
    brand: { '@type': 'Brand', name: company.name },
    manufacturer: { '@id': abs('/#organization') },
    additionalProperty: Object.entries(p.specifications).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    offers: p.price && {
      '@type': 'Offer',
      url: abs(p.path),
      priceCurrency: p.price.currency,
      price: p.price.amount,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      eligibleQuantity: { '@type': 'QuantitativeValue', value: p.moq?.quantity || 1 },
      seller: { '@id': abs('/#organization') },
    },
  };
}

export function itemListSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name })),
  };
}
