# QR-PR — independent pre-release audit

Дата: 24 октября 2026, Europe/Moscow. **STATUS: READY WITH LIMITATIONS.**

Приложение прошло перечисленные локальные проверки после исправлений. Публичный запуск
требует заполнения реальных реквизитов и проверки образа на работающем Docker Engine.
Production-сервер, DNS, сертификаты и существующие сайты Timeweb не изменялись.

## Source and reproducibility

- Repository: https://github.com/alex1c/qrpr
- Baseline / исходный HEAD: `49a876588836eed74ddb3a2dcc57158edbb505cd`.
- Исходный `origin/main` после `git fetch origin`: тот же SHA; дерево было чистым.
- Итоговый SHA проверенного приложения: `68004a37275300f6193735aafb68cd3bca0faef7`.
- Отдельный следующий commit содержит только этот отчёт и результаты измерений.
  Его итоговый SHA воспроизводимо определяется командой
  `git log -1 --format=%H -- docs/PRE_RELEASE_AUDIT.md`.
  Собственный hash невозможно вписать внутрь того же commit без изменения hash.
- Выполнение: Windows, PowerShell, Node `v24.14.0`, Next.js `16.4.3`,
  Playwright `1.64.1`, Vitest `5.0.5`, Lighthouse `13.5.0`.
- Изучены README, ARCHITECTURE, DECISIONS, QA, SEO, DEPLOY, ROADMAP,
  исходный код, локальные руководства установленного Next.js по headers, CSP,
  metadata и deployment. Исходный отчёт QA не принимался за доказательство.

## Findings

Ниже считаются группы связанных дефектов, а не отдельные изменённые строки.

| Severity | Всего | Исправлено | Открыто |
| --- | ---: | ---: | ---: |
| P0 | 0 | 0 | 0 |
| P1 | 1 | 1 | 0 |
| P2 | 15 | 14 | 1 |
| P3 | 2 | 2 | 0 |

| ID | Severity | Подтверждение / проблема | Исправление / состояние |
| --- | --- | --- | --- |
| F01 | P1 | `npm ci` падает: lockfile picomatch 2.3.2 не удовлетворяет 4.0.7 | Исправлен lockfile, повторный чистый `npm ci` успешен |
| F02 | P2 | npm audit: 2 critical + 1 moderate в цепочке Vitest/tinypool/mocker; это dev tooling, не доказанный remote exploit сайта | Vitest 5.0.5, lockfile; 0 vulnerabilities. Уточнены Node engines |
| F03 | P2 | `.trim()` меняет SSID с начальными/конечными пробелами | Точное сохранение SSID и пароля; regression test |
| F04 | P2 | vCard не экранирует одиночный CR, использует LF; iCalendar folding считает UTF-16 символы вместо UTF-8 octets | CR/LF escaping, CRLF, folding до 75 UTF-8 bytes без разрыва code point |
| F05 | P2 | mailto использует form encoding с `+` для пробела; reserved characters адреса меняют URI; URL с bare host:port отвергается как схема | Percent encoding mailto; URL поддерживает host:port и scheme-relative ввод; опасные схемы по-прежнему отвергаются |
| F06 | P2 | Date нормализует несуществующие календарные даты; пустые координаты становятся 0 | Валидация компонентов даты/DST, явная подсказка местного timezone; `valueAsNumber` для пустых координат |
| F07 | P2 | PDF — PNG внутри PDF; SVG/Canvas расходятся в пропорциях логотипа; прозрачные маркеры имеют белые заливки; inline SVG меняет CSS :root | Векторный PDF из SVG; PNG/clipboard растеризуют тот же SVG; even-odd cutouts; scoped CSS больше не нужен. Логотип остаётся bitmap, модули QR в PDF/SVG — vector |
| F08 | P2 | Dots/square не декодируется независимым jsQR; quiet zone по умолчанию 2 модуля | Увеличены точки, служебные модули остаются квадратными; default quiet zone 4, предупреждение при меньшем значении. Все 9 сочетаний стилей декодируются |
| F09 | P2 | Logo upload принимает любые image/* без размера; scanner принимает не только заявленные типы и выделяет canvas произвольного размера | Whitelist; logo ≤2 MiB, rasterization PNG/SVG/JPEG/WebP в безопасный PNG, max 16MP; scanner ≤8 MiB, PNG/JPEG/WebP, max 16MP/8192 px. SVG scripts/external image test успешен |
| F10 | P2 | Late getUserMedia после unmount не останавливается; DOM video меняется при cameraOn; повторное чтение того же файла не вызывает change | Request generation token, остановка late tracks, один video element, очистка srcObject/RAF, reset input value; permission/stop/unmount tests |
| F11 | P2 | Mobile E2E теряет первое значение до hydration; copy-PNG capability меняет server/client markup (React #418); переполнение QR могло показывать готовность | Controls disabled до hydration; capability после hydration; encode capacity проверяется до статуса/экспорта. Добавлена проверка pageerror |
| F12 | P2 | Lighthouse подтверждает контраст 2.88 у footer; белый текст на ярком teal в dark theme имеет низкий контраст | Исправлены faint text tokens и foreground accent controls для обеих тем |
| F13 | P2 | Metadata builder добавляет бренд, layout добавляет повторно; robots запрещает /_next/ | Absolute titles, доступность ресурсов для crawler. Проверены 21 indexable route в server HTML |
| F14 | P2 | Отсутствуют HTTP security headers | CSP, nosniff, frame denial, referrer policy, permissions policy; добавлены container cap_drop/no-new-privileges. CSP limitations описаны ниже |
| F15 | P2 | Lighthouse mobile 85: PDF exporter загружается до использования, ~168 KiB unused JS | PDF/jsPDF/svg2pdf грузятся при нажатии PDF; mobile 91, unused JS ~25 KiB |
| F16 | P3 | Ошибка clipboard scanner не обрабатывается в UI | Catch с понятным сообщением |
| F17 | P2 | Contact/privacy/terms содержат `[указать ...]` | **Открыто: владелец должен предоставить реальные реквизиты. Данные не выдуманы** |
| F18 | P3 | NEXT_PUBLIC_SITE_URL из .env.example может восприниматься как рабочая настройка canonical, но код использует SITE_URL | DEPLOY явно объясняет compile-time источник и необходимость rebuild; дополнены безопасные действия для существующего хоста |

Дополнительное hardening: whitelist цветов и raster data URI для SVG attributes;
JSON-LD заменяет `<` на Unicode escape. В текущих structured-data объектах не было
пользовательского ввода: эксплуатируемый stored XSS не заявляется.

## Functional audit: twelve QR types

Все 12 сериализуются через публичный `serializeQrPayload`, кодируются uqr и обратно
декодируются **независимым jsQR** в `tests/audit.test.ts`. Сравнивается полная строка.

| Тип | Проверенное содержимое |
| --- | --- |
| URL | HTTPS, IDN/Unicode path/query/hash, port; отдельные assertions для host:port, //host и блокировки опасных схем |
| Text | Unicode, emoji, переносы строк; пустое и слишком длинное значение |
| Wi-Fi | SSID/пароль с пробелами, `; , : " \\`, hidden=true; WPA и отдельный open-network test |
| vCard | Unicode, CR/LF escaping, поля N/FN/ORG/TEL/EMAIL/URL/ADR; folding и CRLF |
| Email | Percent-encoded subject/body/address, пробелы, плюс, &, перенос строки |
| Phone | Международный плюс и удаление форматирующих символов |
| SMS | URI encoding Unicode/&, +, ?, переносов строки |
| Telegram | @username и HTTPS t.me invite link; whitelist HTTPS hosts проверен исходным кодом |
| WhatsApp | Международный номер и encoded message |
| Location | Предельные координаты -90/180, ошибки диапазона/NaN, пустой UI ввод |
| Event | VCALENDAR/VEVENT, UTC из explicit +03:00, escaping/folding, невозможная дата |
| PDF link | Только HTTPS URL. UI и SEO-контент объясняют: сначала опубликовать файл; QR содержит ссылку, файл на QR-PR не загружается |

Это проверка payload и декодирования, а не гарантия принятия vCard/ICS/Wi-Fi/SMS всеми
приложениями Android/iOS. Часовой пояс datetime-local — пояс устройства; он указан в форме.

## Export, scanner and UI evidence

- PNG 256/512/1024/2048: реальные download, проверка PNG IHDR размеров,
  затем загрузка каждого файла в scanner и распознавание ожидаемого URL.
- SVG: реальные vector paths, без raster QR image. PDF: реальный `%PDF-`,
  без `/Subtype /Image` для QR без логотипа. QR modules векторные; bitmap logo
  при наличии остаётся bitmap. PDF export повторно проверен после lazy import.
- Styled SVG rasterized в браузере на 512 px, затем декодирован jsQR в Node:
  square/rounded/dots × square/rounded/leaf. ECC L/M/Q/H проверены unit roundtrip.
- Прозрачность: отсутствует белая заливка finder cutouts; экспорт и preview имеют
  единый renderer. Под логотипом остаётся contrast plate. Низкий контраст, малая quiet
  zone и неподходящий ECC вызывают предупреждения, но универсальная читаемость не обещается.
- PNG/JPEG/WebP scanner, Drag & Drop, clipboard paste, повреждённый файл,
  повторный выбор того же файла, MIME rejection, 8 MiB rejection, 16MP guard.
- Camera: mocked отказ, реальный canvas capture MediaStreamTrack для stop/unmount,
  позднее разрешение после ухода со страницы. Физическая камера не проверена.
- Опасный payload `javascript:alert(1)` показывается текстом без Open action;
  ссылки не открываются автоматически. External anchors используют noopener/noreferrer.
- SVG-logo со script/onload/external image растеризуется без исполнения скрипта
  и без обращения к внешнему изображению. Неподдерживаемые/повреждённые logo дают ошибку.
- Viewports 320/375/768/1024/1440, light/dark: `/`, `/qr-wifi`, `/scan`,
  `/qr-with-logo`, отсутствие overflow. Keyboard skip link и базовые формы/кнопки.
  Screenshot стилизованной mobile-страницы просмотрен визуально; редизайн не выполнялся.

## Executed checks

| Check | Итог |
| --- | --- |
| npm ci | PASS после исправления; первый запуск FAIL с picomatch mismatch |
| npm run typecheck | PASS |
| npm run lint | PASS |
| npm test | PASS — 57 tests / 6 files |
| npm run test:e2e -- --workers=2 | PASS — 48 / 48, desktop Chromium + Pixel 5 Chromium emulation; последний полный прогон 23.7s |
| npm run build | PASS — Next standalone, 28 generated static entries; prepare-standalone completed |
| npm audit | PASS — 0 vulnerabilities, включая dev dependencies |
| HTTP smoke | PASS — основные страницы, metadata images/favicon, robots/sitemap: 200; missing route: 404 |
| Docker Compose schema | PASS only `docker compose --env-file .env.example config --no-env-resolution`; loopback 3010, healthcheck/restart/security flags |
| Full default docker compose config | FAIL без локального .env; штатный prerequisite — скопировать .env.example, как в DEPLOY |
| Docker build/run/container health | **NOT VERIFIED**: CLI 29.7.2 есть, Docker Desktop Linux daemon pipe отсутствует. Не PASS |
| Lighthouse | Реальные конечные JSON ниже; ошибки runtime отсутствуют |

История неуспешных запусков: первый расширенный E2E дал 38 PASS / 6 FAIL
(4 из-за неоднозначного test selector `alert`, 2 — потеря input при hydration).
Отдельный style run дал 2 FAIL для dots/square; исправлен renderer. Промежуточный
долгий прогон был прерван и не считается PASS. Одна повторная сборка дала EBUSY:
Windows standalone-server ещё держал файлы. Сервер остановлен, сборка повторена успешно.
Первый Lighthouse во время пересборки был испорчен удалением assets и не является
валидным измерением продукта. Следующий валидный замер выявил contrast/hydration;
они исправлены, конечные результаты сохранены отдельно от этих промежуточных оценок.

## Lighthouse: localhost production build

Порядок категорий: Performance / Accessibility / Best Practices / SEO.
Результаты одиночного локального запуска, а не полевые Core Web Vitals и не SLA.

| Profile | Scores | LCP | TBT | Timestamp UTC |
| --- | --- | --- | --- | --- |
| Mobile simulated throttling | **91 / 100 / 100 / 100** | 3.3 s | 110 ms | 2026-10-24T15:35:41.772Z |
| Desktop preset | **100 / 100 / 100 / 100** | 0.7 s | 0 ms | 2026-10-24T15:35:59.892Z |

Raw evidence: [mobile](lighthouse-mobile.json), [desktop](lighthouse-desktop.json).
Команды: `npx --yes lighthouse http://127.0.0.1:3000 --quiet
--chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo
--output=json --output-path=docs/lighthouse-mobile.json`; desktop добавляет
`--preset=desktop` и другой output-path. Приложение запускалось через `npm start`.

## Security and privacy

- Содержимое QR, Wi-Fi passwords и файлы обрабатываются локально. В `src` нет
  fetch/telemetry/логирования payload, сохранения содержимого в localStorage или внешнего QR API.
  next-themes хранит только preference темы. Статическая страница не получает payload через URL.
- CSP ограничивает origins и запрещает object/frame embedding; однако inline scripts/styles
  разрешены для Next static hydration и theme. Это **не strict nonce CSP** и не полная
  защита от произвольной inline injection. Nonce setup потребовал бы dynamic rendering.
- Rendered SVG принимает только hex colors и raster data URI; raw uploaded SVG не вставляется в DOM.
- Browser image decoder всё равно читает исходное изображение перед pixel guard;
  лимиты bytes/pixels/canvas снижают риск, но не исключают баги browser codecs.
- Сканирование и QR с логотипом/малой quiet zone/на произвольной поверхности требуют
  физического теста. ECC не гарантирует исправление любого перекрытия логотипом.
- npm audit — snapshot registry advisories на дату проверки, не доказательство отсутствия
  всех возможных уязвимостей. Исправленные critical advisories относились к dev tooling.

## SEO

[SEO_AUDIT.json](SEO_AUDIT.json) содержит path/title/description/status всех 21 URLs из sitemap.
Автотест HTTP request проверяет до клиентского JS: ровно один H1, уникальные title и description,
canonical, index/follow, OG, JSON-LD и внутреннюю ссылку generator. Sitemap/robots доступны.
Инструкции и ограничения присутствуют в server HTML. FAQ повторяется по общим темам,
а вводный текст и инструкции конкретны для типа; новые doorway pages не создавались.
Реквизиты contact/privacy/terms остаются placeholder и требуют владельца.
Канонический домен задан в `src/config/site.ts`, а не через .env.example.

## Deploy decision and remaining operator actions

**READY WITH LIMITATIONS**: локальные code/test/build/security/SEO проверки завершены.
До публичного запуска:

1. Указать настоящие operator/contact/address и утвердить legal copy.
2. На работающем Docker Engine выполнить config/build/up, дождаться healthy,
   проверить HTTP с loopback и основные маршруты. Здесь container PASS не заявляется.
3. Проверить свободный порт, сохранить существующие Nginx virtual hosts/certificates,
   добавить отдельный server block, настроить HTTPS и redirect www → apex,
   выполнить `nginx -t`, проверить существующие сайты после reload. См. DEPLOY.md.
4. Проверить физическую камеру, печать/логотипы, реальные Android/iOS scanners.
   Firefox/WebKit/Safari и настоящий mobile device в этой среде не запускались.
5. Повторить Lighthouse по реальному HTTPS deployment: mobile LCP 3.3 s остаётся
   областью улучшения, хотя Performance 91. PNG clipboard зависит от browser permissions;
   paste выполнен автоматически, native OS image clipboard end-to-end не подтверждён.

Без регистрации, платежей, SaaS или Phase 2. Force push не использовался.
