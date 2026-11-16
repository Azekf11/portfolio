// Generates the favicon, the Apple touch icon and the 1200×630 Open Graph image
// from src/data/site.json. Run with `npm run images` after changing the name or role,
// then commit the files in public/.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const site = JSON.parse(await readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));
const out = (f) => new URL(`../public/${f}`, import.meta.url);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const initials = site.name
  .split(/[\s-]+/)
  .map((w) => w[0])
  .join('')
  .slice(0, 3)
  .toUpperCase();

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b6466"/>
  <text x="32" y="41" text-anchor="middle" font-family="${font}" font-size="${initials.length > 2 ? 22 : 28}" font-weight="700" fill="#ffffff">${esc(initials)}</text>
</svg>
`;
await writeFile(out('favicon.svg'), favicon);
await sharp(Buffer.from(favicon), { density: 300 }).resize(180, 180).png().toFile(out('apple-touch-icon.png').pathname);

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e1214"/>
      <stop offset="1" stop-color="#11292a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="96" width="72" height="8" rx="4" fill="#6fd0c8"/>
  <text x="80" y="250" font-family="${font}" font-size="104" font-weight="700" fill="#e8ecee" letter-spacing="-2">${esc(site.name)}</text>
  <text x="80" y="330" font-family="${font}" font-size="40" font-weight="500" fill="#c9d3d7">${esc(site.role)}</text>
  <text x="80" y="520" font-family="${font}" font-size="30" font-weight="500" fill="#6fd0c8">Markets · Data · Applied AI</text>
  <text x="80" y="566" font-family="${font}" font-size="26" fill="#a3afb5">Projects, papers and live demos</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(out('og.png').pathname);

console.log('Wrote public/favicon.svg, public/apple-touch-icon.png, public/og.png');
