import { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { company, categories, getProductsByCategory } from '../data/sunriseData';
import { whatsappLink } from '../site';

const EMPTY = { name: '', phone: '', email: '', company: '', city: '', product: '', quantity: '1', message: '' };

function composeMessage(v) {
  return [
    `Inquiry from ${v.name}${v.company ? ` (${v.company})` : ''}`,
    v.product && `Machine: ${v.product}`,
    v.quantity && `Quantity: ${v.quantity}`,
    `Phone: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    v.city && `City / Country: ${v.city}`,
    v.message && `\nRequirement:\n${v.message}`,
  ].filter(Boolean).join('\n');
}

/**
 * Inquiry form. There is no server behind the site, so "Send" opens the visitor's
 * email app with everything filled in (or WhatsApp, if they prefer).
 */
export default function InquiryForm({ product = '', compact = false }) {
  const [values, setValues] = useState({ ...EMPTY, product });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (!values.name.trim()) e.name = 'Please enter your name.';
    if (!/^[+\d][\d\s-]{6,}$/.test(values.phone.trim())) e.phone = 'Please enter a valid phone number.';
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Please check the email address.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function sendEmail(e) {
    e.preventDefault();
    if (!validate()) return;
    const subject = `Inquiry: ${values.product || 'Machinery requirement'} — ${values.name}`;
    window.location.href = `mailto:${company.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeMessage(values))}`;
    setSent(true);
  }

  function sendWhatsApp() {
    if (!validate()) return;
    window.open(whatsappLink(composeMessage(values)), '_blank', 'noopener');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success">
        <div className="icon-tile"><CheckCircle2 size={24} aria-hidden /></div>
        <h3>Your inquiry is ready to send</h3>
        <p className="muted">
          Please press send in your email or WhatsApp app. If nothing opened, email us at{' '}
          <a href={`mailto:${company.contact.email}`} style={{ color: 'var(--brand-600)', fontWeight: 600 }}>{company.contact.email}</a>{' '}
          or call <a href={`tel:${company.contact.mobile.tel}`} style={{ color: 'var(--brand-600)', fontWeight: 600 }}>{company.contact.mobile.display}</a>.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>Edit inquiry</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={sendEmail} noValidate>
      <div className="form-row">
        <Field label="Your name" required error={errors.name}>
          <input value={values.name} onChange={set('name')} autoComplete="name" required />
        </Field>
        <Field label="Phone / WhatsApp" required error={errors.phone}>
          <input type="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91" required />
        </Field>
      </div>
      <div className="form-row">
        <Field label="Email" error={errors.email}>
          <input type="email" value={values.email} onChange={set('email')} autoComplete="email" />
        </Field>
        <Field label="Company">
          <input value={values.company} onChange={set('company')} autoComplete="organization" />
        </Field>
      </div>
      <div className="form-row">
        <Field label="Machine you are interested in">
          <select value={values.product} onChange={set('product')}>
            <option value="">Not sure yet — please advise</option>
            {categories.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {getProductsByCategory(c.id).map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </optgroup>
            ))}
            {product && !categories.some((c) => getProductsByCategory(c.id).some((p) => p.name === product)) && <option value={product}>{product}</option>}
          </select>
        </Field>
        <div className="form-row" style={{ gridTemplateColumns: '0.7fr 1.3fr' }}>
          <Field label="Quantity">
            <input type="number" min="1" value={values.quantity} onChange={set('quantity')} />
          </Field>
          <Field label="City / Country">
            <input value={values.city} onChange={set('city')} autoComplete="address-level2" />
          </Field>
        </div>
      </div>
      {!compact && (
        <Field label="Your requirement">
          <textarea value={values.message} onChange={set('message')} placeholder="Product, batch size or output per hour, material, automation level…" />
        </Field>
      )}
      <div className="btn-row">
        <button type="submit" className="btn btn-primary"><Mail size={17} aria-hidden /> Send by email</button>
        <button type="button" className="btn btn-wa" onClick={sendWhatsApp}><MessageCircle size={17} aria-hidden /> Send on WhatsApp</button>
      </div>
      <p className="form-note">We usually reply within one working day ({company.contact.businessHours.display}).</p>
    </form>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="field">
      <label>
        {label} {required && <em aria-hidden>*</em>}
        {children}
      </label>
      {error && <div className="error" role="alert">{error}</div>}
    </div>
  );
}
