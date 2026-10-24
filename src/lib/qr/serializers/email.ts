/**
 * mailto: URI serialization for email QR codes.
 */
import type { EmailPayload } from '@/types/qr'

export function serializeEmail(payload: EmailPayload): string {
	const address = payload.address.trim()
	if (!address) {
		throw new Error('Укажите адрес email')
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
		throw new Error('Некорректный адрес email')
	}

	const params: string[] = []
	if (payload.subject.trim()) {
		params.push(`subject=${encodeURIComponent(payload.subject.trim())}`)
	}
	if (payload.body.trim()) {
		params.push(`body=${encodeURIComponent(payload.body.trim())}`)
	}

	const query = params.join('&')
	return query
		? `mailto:${encodeURIComponent(address).replace(/%40/g, '@')}?${query}`
		: `mailto:${encodeURIComponent(address).replace(/%40/g, '@')}`
}

export function validateEmail(payload: EmailPayload): string | null {
	try {
		serializeEmail(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректный email'
	}
}
