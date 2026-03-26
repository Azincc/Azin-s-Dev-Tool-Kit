import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { serverRoutesMap } from './server-routes';

export function render(url: string, _context?: any) {
  const helmetContext: any = {};

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <MemoryRouter initialEntries={[url]}>
          <App routes={serverRoutesMap} />
        </MemoryRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  const { helmet } = helmetContext;
  return { html, helmet };
}

export const routes = Object.keys(serverRoutesMap);
