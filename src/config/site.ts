/**
 * Central site constants for QR-PR.
 * Used by SEO, layout, docs, and UI copy.
 */
export const SITE_NAME = 'QR-PR'
export const SITE_DOMAIN = 'qr-pr.ru'
export const SITE_URL = 'https://qr-pr.ru'
export const SITE_LOCALE = 'ru-RU'
export const SITE_TAGLINE =
	'Бесплатные онлайн-инструменты для создания и проверки QR-кодов'
export const SITE_DESCRIPTION =
	'Создавайте статические QR-коды бесплатно: URL, Wi‑Fi, визитки, Telegram, WhatsApp и другие типы. Без регистрации и водяных знаков. Генерация в браузере.'

/** Contact placeholders — fill in before public launch; do not invent legal details. */
export const CONTACT_EMAIL_PLACEHOLDER = '[указать email]'
export const LEGAL_ENTITY_PLACEHOLDER = '[указать владельца / ИП / организацию]'
export const LEGAL_ADDRESS_PLACEHOLDER = '[указать адрес]'

export const SOCIAL = {
	github: 'https://github.com/alex1c/qrpr',
} as const

export const THEME_STORAGE_KEY = 'qr-pr-theme'

/** Max upload size for scanner / checker (client-side only). */
export const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024

/** Dangerous URL schemes that must never be auto-opened. */
export const BLOCKED_URL_SCHEMES = [
	'javascript:',
	'data:',
	'vbscript:',
	'file:',
] as const
