import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const DOMAIN = process.env.VITE_SITE_URL || 'https://tool.azin.cc';
const APP_PATH = path.join(__dirname, '../src/App.tsx');
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

function generateSitemap() {
    try {
        console.log('Generating sitemap...');
        const appContent = fs.readFileSync(APP_PATH, 'utf8');

        // Extract paths from <Route path="..." />
        // Regex explanation:
        // <Route\s+           Match <Route followed by at least one space
        // [^>]*               Match any attributes before path
        // path="              Match path="
        // ([^"]+)             Capture the path value (anything except quote)
        // "                   Match closing quote
        const routeRegex = /<Route\s+[^>]*path="([^"]+)"/g;
        const paths = new Set();

        let match;
        while ((match = routeRegex.exec(appContent)) !== null) {
            const routePath = match[1];
            // Filter out wildcards and parameters if necessary
            if (routePath !== '*' && !routePath.includes(':')) {
                paths.add(routePath);
            }
        }

        const pathList = Array.from(paths).sort();
        console.log(`Found ${pathList.length} routes:`, pathList);

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pathList
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

        fs.writeFileSync(OUTPUT_PATH, sitemapContent);
        console.log(`Sitemap generated at ${OUTPUT_PATH}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
