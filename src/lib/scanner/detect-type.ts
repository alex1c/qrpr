/**
 * Heuristic content-type detection for decoded QR payloads.
 */
import type { DetectedContentType } from '@/types/qr'
import { BLOCKED_URL_SCHEMES } from '@/config/site'

export function detectContentType (raw: string): DetectedContentType {
	const value = raw.trim()
	if (!value) {
		return 'unknown'
	}
	if (/^WIFI:/i.test(value)) {
		return 'wifi'
	}
	if (/^BEGIN:VCARD/i.test(value)) {
		return 'vcard'
	}
	if (/^BEGIN:VCALENDAR/i.test(value) || /^BEGIN:VEVENT/i.test(value)) {
		return 'event'
	}
	if (/^mailto:/i.test(value)) {
		return 'email'
	}
	if (/^tel:/i.test(value)) {
		return 'phone'
	}
	if (/^(sms|smsto):/i.test(value)) {
		return 'sms'
	}
	if (/^geo:/i.test(value) || /openstreetmap\.org/i.test(value)) {
		return 'geo'
	}
	if (/^https?:\/\//i.test(value)) {
		return 'url'
	}
	if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) {
		return 'url'
	}
	return 'text'
}

export function contentTypeLabel (type: DetectedContentType): string {
	const map: Record<DetectedContentType, string> = {
		url: 'Ссылка (URL)',
		wifi: 'Wi‑Fi',
		vcard: 'Визитка (vCard)',
		email: 'Email',
		phone: 'Телефон',
		sms: 'SMS',
		geo: 'Геолокация',
		event: 'Событие календаря',
		text: 'Текст',
		unknown: 'Неизвестно',
	}
	return map[type]
}

export interface UrlAnalysis {
	isUrl: boolean
	isValidUrl: boolean
	protocol: string | null
	hostname: string | null
	isBlockedScheme: boolean
	isSuspicious: boolean
	warnings: string[]
}

/**
 * Analyze a decoded string as a potential URL.
 * Does NOT claim the destination is safe — only structural checks.
 */
export function analyzeUrl (raw: string): UrlAnalysis {
	const warnings: string[] = []
	const trimmed = raw.trim()
	const lower = trimmed.toLowerCase()

	const isBlockedScheme = BLOCKED_URL_SCHEMES.some((scheme) =>
		lower.startsWith(scheme),
	)
	if (isBlockedScheme) {
		warnings.push('Опасная схема URL — открытие заблокировано.')
	}

	let isValidUrl = false
	let protocol: string | null = null
	let hostname: string | null = null

	try {
		const url = new URL(trimmed)
		isValidUrl = true
		protocol = url.protocol
		hostname = url.hostname

		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			warnings.push(
				`Схема «${url.protocol}» не является обычной веб-ссылкой. Открывайте только если доверяете источнику.`,
			)
		}
		if (url.username || url.password) {
			warnings.push('В URL есть учётные данные — будьте осторожны.')
		}
		// Homograph / IP tricks
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) {
			warnings.push('Ссылка ведёт на IP-адрес, а не на доменное имя.')
		}
		if (url.hostname.includes('xn--')) {
			warnings.push('Домен в punycode — проверьте, что это ожидаемый адрес.')
		}
		if ((url.hostname.match(/\./g) || []).length > 3) {
			warnings.push('Необычная структура домена — внимательно проверьте адрес.')
		}
	} catch {
		isValidUrl = false
	}

	const isUrl =
		/^https?:\/\//i.test(trimmed) ||
		/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)

	const isSuspicious = warnings.length > 0 || isBlockedScheme

	if (isUrl && isValidUrl) {
		warnings.push(
			'Корректный URL ≠ безопасный сайт. QR-PR не проверяет репутацию ресурсов.',
		)
	}

	return {
		isUrl,
		isValidUrl,
		protocol,
		hostname,
		isBlockedScheme,
		isSuspicious,
		warnings: [...new Set(warnings)],
	}
}

/**
 * Whether it is safe to offer an "Open" action for this payload.
 */
export function canOfferOpen (raw: string): boolean {
	const analysis = analyzeUrl(raw)
	if (analysis.isBlockedScheme) {
		return false
	}
	if (!analysis.isValidUrl) {
		return false
	}
	const protocol = analysis.protocol
	return protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:' || protocol === 'tel:'
}
