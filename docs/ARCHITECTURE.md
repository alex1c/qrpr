# Architecture

## Overview

QR-PR is a Next.js App Router application focused on **client-side** static QR generation, styling, export, scanning, and basic content checks.

```
src/
  app/           # Routes, metadata, sitemap, robots
  components/
    ui/          # Buttons, inputs
    layout/      # Header, footer, theme
    qr/          # Generator, preview, style, forms
    scanner/     # Decode UI
    seo/         # Breadcrumbs, FAQ, tool page shell
  lib/
    qr/          # Encode, render, serializers, contrast
    export/      # PNG / SVG / PDF / clipboard / filenames
    scanner/     # jsQR wrapper + URL analysis
    seo/         # Metadata + JSON-LD
  config/        # Site + tool catalog
  types/         # Shared domain types
tests/           # Vitest unit + roundtrip
e2e/             # Playwright
docs/            # Operator documentation
```

## Principles

1. **Serialization ≠ UI** — payload formats live in `lib/qr/serializers`.
2. **Export ≠ generation** — canvas/SVG renderers are separate from download helpers.
3. **SEO catalog is central** — `config/tools.ts` drives nav, sitemap, and pages.
4. **No database in MVP** — architecture leaves room for accounts / dynamic QR later.
5. **Privacy by default** — user payload stays in the browser for static tools.

## QR pipeline

1. Form state → `validateQrPayload` / `serializeQrPayload`
2. String payload → `uqr.encode` matrix
3. Matrix → SVG (`render-svg`) or Canvas (`render-canvas`)
4. Export → Blob download or ClipboardItem

## Scanning

`jsQR` decodes `ImageData` from file, paste, or camera frames. Dangerous URL schemes are blocked from the “Open” action. No server round-trip.

## Future extension points

- Batch / CSV: new route + worker client module; reuse serializers/export.
- Dynamic QR: add API routes + DB without changing static client engine.
- i18n: copy currently Russian; keep strings near pages / `config` for later locales.
