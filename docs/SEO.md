# SEO

## Domain

Canonical base: `https://qr-pr.ru` (`SITE_URL` in `src/config/site.ts`).

## Indexable pages

- `/`
- `/generator`
- `/qr-url` … `/qr-pdf` (12 type pages)
- `/qr-with-logo`
- `/scan`
- `/check`
- `/about`, `/contact`, `/privacy`, `/terms`

Each tool page has unique title, description, H1, instructional copy, FAQ, canonical, Open Graph via Next metadata, and BreadcrumbList JSON-LD where applicable.

## Technical

- `src/app/sitemap.ts` → `/sitemap.xml`
- `src/app/robots.ts` → `/robots.txt`
- `src/app/opengraph-image.tsx` + `icon.tsx`
- WebSite + SoftwareApplication JSON-LD on the root layout
- FAQPage JSON-LD on pages that render `FaqSection`
- `lang="ru-RU"`

## Rules

- Do not invent ranking guarantees.
- Do not index user-generated query duplicates (no such routes in MVP).
- Avoid thin doorway pages: every route ships a working tool or honest legal copy.
