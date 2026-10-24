# Deploy (Timeweb / Ubuntu 24.04 + Docker + Nginx)

This guide prepares a **manual** production deploy. It does **not** change DNS, issue certificates, or SSH into your server.

## Recommended topology

```
Internet → Nginx (host, TLS) → 127.0.0.1:3010 → Docker container :3000
```

Default compose bind: `127.0.0.1:3010:3000` (`QRPR_PORT`). Change the port if busy.

## Prerequisites

- Docker Engine + Compose plugin
- Nginx on the host
- Domain `qr-pr.ru` pointing to the server (operator action)
- TLS certificate (operator action, e.g. certbot)

## Build & run

```bash
cp .env.example .env
# edit QRPR_PORT if needed

docker compose build
docker compose up -d
curl -I http://127.0.0.1:3010/
```

## Nginx sketch (host)

```nginx
server {
  listen 443 ssl http2;
  server_name qr-pr.ru www.qr-pr.ru;

  # ssl_certificate     /path/to/fullchain.pem;
  # ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3010;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Do not publish the container on `0.0.0.0` if Nginx already terminates public traffic.

## Updates

```bash
git pull
docker compose build
docker compose up -d
```

## Notes

- App uses Next.js `output: 'standalone'`.
- No database volume required for MVP.
- Fill legal placeholders in `src/config/site.ts` before public launch.

## Pre-release verification and safe coexistence

See [PRE_RELEASE_AUDIT.md](PRE_RELEASE_AUDIT.md) for measured results and remaining limits.
Use Node 22.12+ (22.x), Node 24.x, or Node 26+ for local tooling; the Docker image uses Node 22.
The `.env.example` site URL is informational: canonical URLs are defined by `SITE_URL` in
`src/config/site.ts`. Change that constant and rebuild if using another public domain.

Before public release, replace operator/contact/address placeholders in `src/config/site.ts`.
On a machine with Docker running, verify:

```bash
cp .env.example .env
docker compose config
docker compose build
docker compose up -d
docker compose ps
curl -fsS http://127.0.0.1:3010/ >/dev/null
curl -fsS http://127.0.0.1:3010/scan >/dev/null
curl -fsS http://127.0.0.1:3010/sitemap.xml >/dev/null
```

`healthy` must appear after the configured healthcheck interval. A valid Compose config alone
is not evidence that the image builds or runs. The container runs as UID 1001, drops all Linux
capabilities and forbids privilege escalation. It has no database or user-content volume.

For an existing Timeweb host, first inventory current containers, listening ports and Nginx
virtual hosts. Back up the relevant Nginx configuration. Choose an unused loopback port and
add a dedicated virtual host for this domain; keep existing sites and certificates in place.
Run `nginx -t` before reloading Nginx and smoke-test existing domains after the reload.
Configure certificates and an HTTP-to-HTTPS redirect manually. Enable HSTS only at the TLS
proxy after HTTPS works; apply it to this host without assuming other subdomains support TLS.
Route `www.qr-pr.ru` to the canonical apex using a redirect with a valid certificate.

Stop a local `npm start` before rebuilding in the same directory on Windows: the running
standalone server locks output files. Docker builds use isolated build stages.

The static pages use a CSP that allows inline Next.js hydration/theme scripts and inline styles.
It restricts resource origins, frames, objects, base URI and form actions, but `unsafe-inline`
means it is not a strict nonce-based XSS policy. Nonces require a separately designed dynamic
rendering setup. QR contents remain local; no external QR API is used.
