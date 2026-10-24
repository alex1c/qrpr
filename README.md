# QR-PR

Бесплатные онлайн-инструменты для создания, оформления, считывания и проверки QR-кодов.

- Сайт: [https://qr-pr.ru](https://qr-pr.ru)
- Репозиторий: [https://github.com/alex1c/qrpr](https://github.com/alex1c/qrpr)

Статические QR генерируются **в браузере**: без регистрации, без водяных знаков, без автоматической отправки содержимого на сервер.

## Возможности

- Типы: URL, текст, Wi‑Fi, vCard, Email, телефон, SMS, Telegram, WhatsApp, геолокация, событие календаря, ссылка на PDF/файл
- Оформление: цвета, отступы, ECC, стили модулей/маркеров, логотип, пресеты
- Экспорт: PNG (256–2048), SVG, PDF, копирование PNG (если поддерживается)
- Сканер и проверка QR из изображения / камеры
- SEO-страницы, светлая/тёмная тема

## Стек

Next.js (App Router) · TypeScript · Tailwind CSS · uqr · jsQR · jsPDF · Vitest · Playwright · Docker

## Локальный запуск

```bash
npm ci
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Разработка |
| `npm run build` | Production build |
| `npm start` | Запуск production-сборки |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit / roundtrip (Vitest) |
| `npm run test:e2e` | Playwright E2E |

## Docker

```bash
cp .env.example .env
docker compose build
docker compose up -d
```

По умолчанию приложение слушает `127.0.0.1:3010` на хосте. Подробности: [docs/DEPLOY.md](docs/DEPLOY.md).

## Документация

- [Architecture](docs/ARCHITECTURE.md)
- [SEO](docs/SEO.md)
- [Deploy](docs/DEPLOY.md)
- [QA](docs/QA.md)
- [Roadmap](docs/ROADMAP.md)
- [Decisions](docs/DECISIONS.md)

## Лицензия

Исходный код проекта — см. репозиторий. Перед публичным запуском заполните реквизиты в `src/config/site.ts`.
