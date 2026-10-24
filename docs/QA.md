# QA report

Freeze date: 2026-10-24 (MVP v1)

## Commands run

```bash
npm run typecheck   # PASS
npm run lint        # PASS
npm test            # PASS — 38 tests
npm run build       # PASS — 28 static routes
npm run test:e2e    # PASS — 12/12 (chromium + mobile)
docker compose build # BLOCKED — Docker Desktop daemon not running in CI workstation
```

## Results

| Check | Result |
| --- | --- |
| TypeScript | PASS |
| ESLint | PASS |
| Unit + roundtrip | PASS (38) |
| Production build | PASS |
| Playwright E2E | PASS (12) |
| Docker image build | NOT RUN (daemon unavailable) |

## E2E coverage executed

1. Home → URL QR preview  
2. Download PNG  
3. Wi‑Fi + vCard pages  
4. Theme toggle  
5. Scan uploaded QR screenshot  
6. Mobile viewport / no horizontal overflow  

## Known environment limits

- Camera permission flows are UI-covered, not automated in CI.
- Clipboard PNG depends on browser support.
- Lighthouse scores are targets for operator verification, not asserted in CI.
- Docker build must be verified on a host with a running Docker engine.

## READY FOR QA criteria

All functional MVP criteria met except Docker image build verification on this machine (config present; daemon was down).
