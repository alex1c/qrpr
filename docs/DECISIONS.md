# Architecture decisions

## ADR-001: Client-side static generation

**Decision:** Encode and render static QR codes in the browser with `uqr` + custom SVG/Canvas renderers.

**Why:** Privacy, zero API cost, instant preview, works offline after load.

## ADR-002: Custom renderer instead of qr-code-styling

**Decision:** Build styled SVG/Canvas on top of `uqr` matrices.

**Why:** Testable in Node, true vector SVG, no browser-only styling dependency for unit tests, smaller conceptual surface.

## ADR-003: jsQR for decode

**Decision:** Use `jsQR` for image and camera frame decoding.

**Why:** Mature, no server, works with ImageData; shared by `/scan` and `/check`.

## ADR-004: No database in MVP

**Decision:** Defer accounts, dynamic QR, and storage.

**Why:** Ship a trustworthy static tool first; keep extension points documented.

## ADR-005: Honest legal placeholders

**Decision:** Mark unknown entity/email/address explicitly instead of inventing details.

**Why:** Avoid publishing false legal information.

## ADR-006: Host port 3010 loopback

**Decision:** Default Docker publish `127.0.0.1:3010:3000`.

**Why:** Avoid clashing with other host projects; Nginx terminates public traffic.
