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
