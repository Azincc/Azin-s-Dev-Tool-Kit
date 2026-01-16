import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

const DOMAIN = process.env.VITE_SITE_URL || 'https://tool.azin.cc';

async function prerender() {
  const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8');

  // Convert path to file URL for dynamic import on Windows
  const serverEntry = pathToFileURL(toAbsolute('dist/server/entry-server.js')).toString();
  const { render, routes } = await import(serverEntry);

  console.log(`Prerendering ${routes.length} routes...`);

  // Sitemap content
  let sitemapUrls = [];

  for (const url of routes) {
    const { html, helmet } = render(url);

    const head = `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `;

    const htmlContent = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);

    const filePath = `dist/static${url === '/' ? '/index.html' : `${url}/index.html`}`;
    const fullPath = toAbsolute(filePath);
    const dirPath = path.dirname(fullPath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, htmlContent);
    console.log(`Generated ${filePath}`);

    // Add to sitemap
    sitemapUrls.push(url);
  }

  // Generate Sitemap
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map((route) => {
    const url = `${DOMAIN}${route === '/' ? '' : route}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  fs.writeFileSync(toAbsolute('dist/static/sitemap.xml'), sitemapContent);
  console.log('Sitemap generated at dist/static/sitemap.xml');

  console.log('SSG build complete.');
}

prerender().catch((e) => {
  console.error(e);
  process.exit(1);
});
