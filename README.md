# Portfolio

Personal site of Anh-Vu Ta: projects around markets, data and applied AI.

Static site built with [Astro](https://astro.build), hosted on Vercel. Every push to `main` is
deployed automatically.

## Add or edit a project

All projects live in [`src/data/projects.json`](src/data/projects.json). See
[docs/ADD_A_PROJECT.md](docs/ADD_A_PROJECT.md).

## Run locally

Requires Node 22.12 or later.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm test           # Playwright tests against a local build
BASE_URL=https://your-live-url npm test   # same tests against the live site
```

## Layout

```
src/data/projects.json   projects shown on the site
src/data/site.json       name, role, bio, contact links
src/assets/projects/     project screenshots (converted to AVIF/WebP at build time)
src/pages/               home page, 404, robots.txt
scripts/make-images.mjs  favicon and 1200×630 preview image
tests/                   Playwright tests
```
