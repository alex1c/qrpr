/**
 * tel: URI serialization — preserves international prefix.
 */

export function normalizePhone (raw: string): string {
	// Keep +, digits; allow spaces/dashes in input then strip formatting for URI
	const trimmed = raw.trim()
	const hasPlus = trimmed.startsWith('+')
	const digits = trimmed.replace(/[^\d]/g, '')
	return hasPlus ? `+${digits}` : digits
}

export function serializePhone (raw: string): string {
	const phone = normalizePhone(raw)
	if (!phone || phone === '+') {
		throw new Error('Укажите номер телефона')
	}
	if (phone.replace('+', '').length < 5) {
		throw new Error('Номер слишком короткий')
	}
	return `tel:${phone}`
}

export function validatePhone (raw: string): string | null {
	try {
		serializePhone(raw)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректный номер'
	}
}
