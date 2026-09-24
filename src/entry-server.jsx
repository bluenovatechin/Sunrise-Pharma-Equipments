/* eslint-disable react/only-export-components -- server entry, not a hot-reloaded component module */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { HeadContext, renderHead } from './seo/head';

export { allRoutes, SITE_URL } from './site';
export { navigation } from './data/sunriseData';

/** Render one route to HTML + the <head> tags its page declared. */
export function render(url) {
  const head = { current: null };
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadContext.Provider>,
  );
  return { html, head: renderHead(head.current) };
}
