import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ChevronDown, Clock, Mail, MapPin, Menu, MessageCircle, Phone, ShieldCheck, X,
} from 'lucide-react';
import { company, categories, navigation } from '../data/sunriseData';
import { whatsappLink } from '../site';
import InquiryForm from './InquiryForm';
import { QuoteContext } from './quote-context';

export default function Layout() {
  const [quote, setQuote] = useState(null); // null = closed, string = product name ('' for general)
  const openQuote = useCallback((product = '') => setQuote(product || ''), []);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <a href="#main" className="skip-link">Skip to content</a>
      <TopBar />
      <Header onQuote={() => openQuote()} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <div className="float-actions">
        <a href={whatsappLink('Hello Sunrise Pharma Equipments, I would like to know more about your machines.')} className="float-wa" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <MessageCircle size={24} aria-hidden />
        </a>
        <a href={`tel:${company.contact.mobile.tel}`} className="float-call" aria-label={`Call ${company.contact.mobile.display}`}>
          <Phone size={22} aria-hidden />
        </a>
      </div>
      {quote !== null && <QuoteModal product={quote} onClose={() => setQuote(null)} />}
    </QuoteContext.Provider>
  );
}

function TopBar() {
  const c = company.contact;
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-group hide-sm">
          <span><Clock size={14} aria-hidden /> {c.businessHours.display}</span>
          <span><ShieldCheck size={14} aria-hidden /> GST {company.legal.gstNumber}</span>
        </div>
        <div className="topbar-group topbar-actions">
          <a href={`tel:${c.mobile.tel}`} className="topbar-phone"><Phone size={14} aria-hidden /> {c.mobile.display}</a>
          <a href={`mailto:${c.email}`} className="hide-sm"><Mail size={14} aria-hidden /> {c.email}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="topbar-wa-link" aria-label="Chat on WhatsApp">
            <MessageCircle size={14} aria-hidden /> <span className="topbar-wa-text">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Header({ onQuote }) {
  // The drawer belongs to the page it was opened on, so navigating closes it.
  const { pathname } = useLocation();
  const [openOn, setOpenOn] = useState(null);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const open = openOn === pathname;
  const setOpen = (v) => setOpenOn(v ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape, and when the viewport grows into the desktop layout.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenOn(null);
    };
    const desktop = window.matchMedia('(min-width: 1025px)');
    const onResize = (e) => e.matches && setOpenOn(null);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
    };
  }, []);

  // Move focus into the drawer on open and back to the toggle on close.
  const toggleRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
    <header className="header">
      <div className="container">
        <Link to="/" className="brand" aria-label={`${company.name} — home`}>
          <img src={company.logo.src} alt="" width="74" height="46" />
          <span className="brand-text">
            <strong>{company.name}</strong>
            <span className="brand-sub">{company.focus}</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {navigation.header.map((item) =>
            item.megaMenu ? (
              <div className="nav-item" key={item.path}>
                <NavLink to={item.path} className="nav-link">
                  <span>{item.label}</span>
                  <ChevronDown size={14} aria-hidden className="nav-chevron" />
                </NavLink>
                <div className="mega">
                  {categories.map((c) => (
                    <Link key={c.id} to={c.path} className="mega-item">
                      <img src={c.image} alt="" loading="lazy" width="52" height="52" />
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.productIds.length} {c.productIds.length === 1 ? 'model' : 'models'} · {c.guide.tagline}</span>
                      </div>
                    </Link>
                  ))}
                  <div className="mega-foot">
                    <span className="muted">Custom capacities and PLC automation available</span>
                    <Link to="/products" className="link-arrow">Browse all {categories.reduce((acc, c) => acc + c.productIds.length, 0)} machines →</Link>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className="nav-link">
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="header-cta">
          <button type="button" className="btn btn-primary header-quote-btn" onClick={onQuote}>
            <span className="quote-text-full">Get a Quote</span>
            <span className="quote-text-short">Quote</span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            className={`menu-toggle ${open ? 'menu-toggle--active' : ''}`}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>
    </header>

      {/* Kept outside <header>: its backdrop-filter would clip these fixed layers to the header box. */}
      {open && (
        <>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside id="mobile-nav" className="drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
            <div className="drawer-head">
              <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label={`${company.name} — home`}>
                <img src={company.logo.src} alt="" width="56" height="35" />
                <span className="brand-text">
                  <strong>{company.name}</strong>
                  <span className="brand-sub">{company.focus}</span>
                </span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                className="drawer-close-btn"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="drawer-body">
              <nav className="drawer-nav" aria-label="Mobile Navigation">
                {navigation.header.map((item) =>
                  item.megaMenu ? (
                    <div key={item.path} className="drawer-nav-group">
                      <div className="drawer-nav-row">
                        <NavLink
                          to={item.path}
                          className="drawer-link"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                        <button
                          type="button"
                          className={`drawer-accordion-btn ${productsExpanded ? 'drawer-accordion-btn--expanded' : ''}`}
                          aria-label="Toggle categories"
                          aria-expanded={productsExpanded}
                          onClick={() => setProductsExpanded(!productsExpanded)}
                        >
                          <ChevronDown size={18} aria-hidden />
                        </button>
                      </div>
                      {productsExpanded && (
                        <div className="drawer-sub">
                          {categories.map((c) => (
                            <Link
                              key={c.id}
                              to={c.path}
                              className="drawer-sub-card"
                              onClick={() => setOpen(false)}
                            >
                              <img src={c.image} alt="" loading="lazy" width="36" height="36" />
                              <div>
                                <strong>{c.name}</strong>
                                <span>{c.productIds.length} {c.productIds.length === 1 ? 'model' : 'models'}</span>
                              </div>
                            </Link>
                          ))}
                          <Link to="/products" className="drawer-view-all" onClick={() => setOpen(false)}>
                            Browse all {categories.reduce((acc, c) => acc + c.productIds.length, 0)} machines →
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={item.path} className="drawer-nav-group">
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className="drawer-link"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    </div>
                  ),
                )}
              </nav>

              <div className="drawer-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => { setOpen(false); onQuote(); }}
                >
                  Get a Free Quote
                </button>

                <div className="drawer-contact-grid">
                  <a href={`tel:${company.contact.mobile.tel}`} className="drawer-contact-card">
                    <Phone size={16} aria-hidden style={{ color: 'var(--brand)' }} />
                    <div>
                      <span className="drawer-contact-sub">Call Sales</span>
                      <strong>{company.contact.mobile.display}</strong>
                    </div>
                  </a>
                  <a
                    href={whatsappLink('Hello Sunrise Pharma Equipments, I would like to inquire about your machines.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drawer-contact-card drawer-contact-card--wa"
                  >
                    <MessageCircle size={16} aria-hidden style={{ color: '#25D366' }} />
                    <div>
                      <span className="drawer-contact-sub">WhatsApp</span>
                      <strong>Chat Now</strong>
                    </div>
                  </a>
                </div>

                <div className="drawer-info-block">
                  <a href={`mailto:${company.contact.email}`} className="drawer-info-line">
                    <Mail size={14} aria-hidden />
                    <span>{company.contact.email}</span>
                  </a>
                  <div className="drawer-info-line">
                    <Clock size={14} aria-hidden />
                    <span>{company.contact.businessHours.display}</span>
                  </div>
                  <div className="drawer-trust-badge">
                    GST: {company.legal.gstNumber} · Ahmedabad, India
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function Footer() {
  const c = company.contact;
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={company.logo.src} alt={company.name} width="84" height="52" />
            <p>
              {company.headline}. Process &amp; packaging machinery for liquid &amp; ointment products, made in Ahmedabad, India since {company.yearOfEstablishment}.
            </p>
            <p className="small">GST: {company.legal.gstNumber} · IEC: {company.legal.ieCode}</p>
            <div className="footer-social">
              {company.social.facebook && <a href={company.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>}
              {company.social.youtube && <a href={company.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon /></a>}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={18} aria-hidden /></a>
            </div>
          </div>

          <div>
            <h4>Products</h4>
            <ul>
              {categories.map((cat) => <li key={cat.id}><Link to={cat.path}>{cat.name}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              {navigation.footerQuickLinks.map((l) => <li key={l.path}><Link to={l.path}>{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li><MapPin size={16} aria-hidden /><span>{company.addresses.office.full}</span></li>
              <li><Phone size={16} aria-hidden /><span><a href={`tel:${c.mobile.tel}`}>{c.mobile.display}</a><br /><a href={`tel:${c.phone.tel}`}>{c.phone.display}</a></span></li>
              <li><Mail size={16} aria-hidden /><a href={`mailto:${c.email}`}>{c.email}</a></li>
              <li><Clock size={16} aria-hidden /><span>{c.businessHours.display}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {navigation.footerCopyright}</span>
          <span>
            {company.people[0].role}: {company.people[0].name} ·{' '}
            {company.trustBadge.link ? <a href={company.trustBadge.link} target="_blank" rel="noopener noreferrer">{company.trustBadge.platform} — {company.trustBadge.title}</a> : company.trustBadge.title}
          </span>
        </div>
      </div>
    </footer>
  );
}

function QuoteModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={18} aria-hidden /></button>
        <div className="eyebrow">Free quotation</div>
        <h2 id="quote-title" style={{ fontSize: '1.5rem' }}>{product ? `Get a quote for ${product}` : 'Tell us what you need'}</h2>
        <p className="muted small" style={{ marginBottom: 18 }}>Share a few details and our team will get back to you with the right configuration and price.</p>
        <InquiryForm product={product} compact={false} />
      </div>
    </div>
  );
}

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
  </svg>
);
