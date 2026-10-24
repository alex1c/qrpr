/**
 * Yandex Metrika configuration for QR-PR.
 * Script loads only after explicit analytics consent.
 */
export const YANDEX_METRIKA_ID = 68948335

export const YANDEX_METRIKA_OPTIONS = {
	webvisor: false,
	clickmap: false,
	accurateTrackBounce: true,
	trackLinks: true,
	/**
	 * Do not enable form / content tracking — generator fields and QR
	 * payloads must never be sent to analytics.
	 */
	ecommerce: false,
} as const

/** Domains required for the selected Metrika integration (CSP allowlist). */
export const YANDEX_METRIKA_ORIGINS = [
	'https://mc.yandex.ru',
	'https://mc.yandex.com',
] as const
