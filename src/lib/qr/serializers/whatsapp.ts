/**
 * WhatsApp wa.me link serialization.
 */
import type { WhatsAppPayload } from '@/types/qr'

/**
 * Strip formatting; require international digits without leading +.
 */
export function normalizeWhatsAppPhone (raw: string): string {
	const digits = raw.trim().replace(/[^\d]/g, '')
	return digits
}

export function serializeWhatsApp (payload: WhatsAppPayload): string {
	const phone = normalizeWhatsAppPhone(payload.phone)
	if (!phone) {
		throw new Error('Укажите международный номер без + (например 79991234567)')
	}
	if (phone.length < 8 || phone.length > 15) {
		throw new Error('Номер должен содержать от 8 до 15 цифр')
	}

	const base = `https://wa.me/${phone}`
	const message = payload.message.trim()
	if (message) {
		return `${base}?text=${encodeURIComponent(message)}`
	}
	return base
}

export function validateWhatsApp (payload: WhatsAppPayload): string | null {
	try {
		serializeWhatsApp(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректные данные WhatsApp'
	}
}
