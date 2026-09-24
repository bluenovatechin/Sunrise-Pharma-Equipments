import { useContext, useEffect } from 'react';
import { HeadContext, buildHead } from './head';

/** Declares the page's title, description and structured data. Renders nothing. */
export default function Seo(props) {
  const collector = useContext(HeadContext);
  const head = buildHead(props);
  if (collector) collector.current = head;

  const key = JSON.stringify(head);
  useEffect(() => {
    document.title = head.title;
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    const add = (el) => { el.setAttribute('data-seo', ''); document.head.appendChild(el); };
    for (const [attr, name, value] of head.meta) {
      if (!value) continue;
      const m = document.createElement('meta');
      m.setAttribute(attr, name);
      m.setAttribute('content', value);
      add(m);
    }
    if (head.canonical) {
      const l = document.createElement('link');
      l.rel = 'canonical';
      l.href = head.canonical;
      add(l);
    }
    for (const j of head.jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(j);
      add(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
