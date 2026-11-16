// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the project's production domain,
// so canonical links, Open Graph URLs and the sitemap follow the live address.
const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = host ? (host.startsWith('http') ? host : `https://${host}`) : 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  build: {
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
