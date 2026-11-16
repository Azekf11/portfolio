# Add a project

Every project on the site comes from one file: [`src/data/projects.json`](../src/data/projects.json).
You never need to touch the pages or the components.

## 1. Add an entry to `src/data/projects.json`

Add an object to the `projects` array:

```json
{
  "id": "my-new-project",
  "title": "My new project",
  "tagline": "One or two sentences on what it does, taken from the repository README.",
  "status": "Finished, November 2026",
  "highlights": [
    "A concrete point the README supports.",
    "Another one. Two or three are enough."
  ],
  "stack": ["Python", "pandas"],
  "links": [
    { "label": "Live demo", "url": "https://example.com" },
    { "label": "Code", "url": "https://github.com/Azekf11/my-new-project" }
  ],
  "image": "my-new-project.png",
  "imageAlt": "What the screenshot shows.",
  "category": "featured",
  "order": 4
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Unique, lowercase, with dashes. |
| `title` | yes | Shown as the card heading. |
| `tagline` | yes | Short description. |
| `status` | no | Leave `""` to hide it. |
| `highlights` | yes | Can be `[]`. |
| `stack` | yes | Also feeds the Skills section. |
| `links` | yes | Each link opens in a new tab. |
| `image` | no | File name in `src/assets/projects/`. Leave `""` for a card without an image. |
| `imageAlt` | if `image` | Describes the screenshot for screen readers. |
| `category` | yes | `"featured"` or `"learning"`. |
| `order` | yes | Position inside its category, 1 first. |

## 2. Add the screenshot (optional)

Put a PNG or JPG in `src/assets/projects/` with the name used in `image`.
A width of about 1200 px is enough. The build converts it to AVIF and WebP at several sizes.
The build stops with a clear message if the file is missing.

## 3. Check and publish

```bash
npm run dev      # preview at http://localhost:4321
npm test         # optional: builds the site and runs the browser tests
git add -A && git commit -m "Add my-new-project" && git push
```

Vercel rebuilds and publishes the site on every push to `main`, usually in under a minute.

## Changing the name, role or contact links

Edit [`src/data/site.json`](../src/data/site.json). To show a LinkedIn button, put the profile URL
in `contact.linkedin` (it is hidden while empty). After changing the name or the role, run
`npm run images` and commit the files it rewrites in `public/` (favicon and preview image).
