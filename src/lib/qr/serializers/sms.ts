/**
 * SMS URI serialization (sms: and SMSTO-compatible).
 * Uses sms:+number?body= for broad mobile support.
 */
import { normalizePhone } from '@/lib/qr/serializers/phone'
import type { SmsPayload } from '@/types/qr'

export function serializeSms (payload: SmsPayload): string {
	const phone = normalizePhone(payload.phone)
	if (!phone || phone === '+') {
		throw new Error('Укажите номер телефона')
	}

	const message = payload.message
	if (message) {
		return `sms:${phone}?body=${encodeURIComponent(message)}`
	}
	return `sms:${phone}`
}

export function validateSms (payload: SmsPayload): string | null {
	try {
		serializeSms(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректные данные SMS'
	}
}
