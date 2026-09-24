import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Hydrate only when the HTML was pre-rendered for this exact URL. The dev server, and hosts that
// fall back to another page (e.g. index.html for unknown paths), get a fresh client render instead.
const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const normalize = (p) => p.replace(/\.html$/, '').replace(/(.)\/$/, '$1');
const currentPath = base && location.pathname.startsWith(base)
  ? location.pathname.slice(base.length) || '/'
  : location.pathname;

if (container.hasChildNodes() && normalize(container.dataset.route || '') === normalize(currentPath)) {
  hydrateRoot(container, app);
} else {
  container.textContent = '';
  createRoot(container).render(app);
}
