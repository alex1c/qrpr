/**
 * mailto: URI serialization for email QR codes.
 */
import type { EmailPayload } from '@/types/qr'

export function serializeEmail (payload: EmailPayload): string {
	const address = payload.address.trim()
	if (!address) {
		throw new Error('Укажите адрес email')
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
		throw new Error('Некорректный адрес email')
	}

	const params = new URLSearchParams()
	if (payload.subject.trim()) {
		params.set('subject', payload.subject.trim())
	}
	if (payload.body.trim()) {
		params.set('body', payload.body.trim())
	}

	const query = params.toString()
	return query ? `mailto:${address}?${query}` : `mailto:${address}`
}

export function validateEmail (payload: EmailPayload): string | null {
	try {
		serializeEmail(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректный email'
	}
}
