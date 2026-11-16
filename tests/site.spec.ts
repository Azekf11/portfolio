import { test, expect } from '@playwright/test';
import data from '../src/data/projects.json' with { type: 'json' };
import site from '../src/data/site.json' with { type: 'json' };

test('home page shows the hero, every project and the contact links', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await expect(page).toHaveTitle(new RegExp(site.name));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.name);
  await expect(page.getByText(site.role).first()).toBeVisible();

  for (const p of data.projects) {
    const card = page.getByRole('article', { name: p.title });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    for (const l of p.links) {
      await expect(card.locator(`a[href="${l.url}"]`)).toHaveCount(1);
    }
  }

  await expect(page.locator(`a[href="mailto:${site.contact.email}"]`).first()).toBeVisible();
  await expect(page.locator(`a[href="${site.contact.github}"]`).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('navigation links scroll to their sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('heading', { name: 'Contact' })).toBeInViewport();
});

test('theme toggle switches and remembers the theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /switch to (dark|light) theme/i });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('keyboard users can skip to the content', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
});

test('meta tags, sitemap, robots and 404 are in place', async ({ page, request }) => {
  await page.goto('/');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toMatch(/\/og\.png$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  expect(await page.locator('meta[name="generator"]').count()).toBe(0);

  const ogRes = await request.get('/og.png');
  expect(ogRes.ok()).toBeTruthy();
  expect((await request.get('/sitemap-index.xml')).ok()).toBeTruthy();
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/favicon.svg')).ok()).toBeTruthy();

  const missing = await page.goto('/this-page-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('every link on the page answers', async ({ request, page }) => {
  test.skip(test.info().project.name !== 'desktop', 'checked once');
  await page.goto('/');
  const hrefs = await page.locator('a[href^="http"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).href))]);
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const res = await request.get(href, { maxRedirects: 10, timeout: 30_000 });
    expect.soft(res.status(), href).toBeLessThan(400);
  }
});
