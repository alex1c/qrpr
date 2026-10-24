/**
 * vCard 3.0 serialization for contact QR codes.
 */
import { escapeVCardValue } from '@/lib/qr/escape'
import type { VCardPayload } from '@/types/qr'

export function serializeVCard (payload: VCardPayload): string {
	const first = payload.firstName.trim()
	const last = payload.lastName.trim()

	if (!first && !last) {
		throw new Error('Укажите имя или фамилию')
	}

	const lines: string[] = [
		'BEGIN:VCARD',
		'VERSION:3.0',
		`N:${escapeVCardValue(last)};${escapeVCardValue(first)};;;`,
		`FN:${escapeVCardValue(`${first} ${last}`.trim())}`,
	]

	if (payload.organization.trim()) {
		lines.push(`ORG:${escapeVCardValue(payload.organization.trim())}`)
	}
	if (payload.title.trim()) {
		lines.push(`TITLE:${escapeVCardValue(payload.title.trim())}`)
	}
	if (payload.phone.trim()) {
		lines.push(`TEL;TYPE=CELL:${escapeVCardValue(payload.phone.trim())}`)
	}
	if (payload.email.trim()) {
		lines.push(`EMAIL:${escapeVCardValue(payload.email.trim())}`)
	}
	if (payload.url.trim()) {
		lines.push(`URL:${escapeVCardValue(payload.url.trim())}`)
	}
	if (payload.address.trim()) {
		// ADR: ;;street;city;region;postal;country — put full address in street field
		lines.push(`ADR;TYPE=HOME:;;${escapeVCardValue(payload.address.trim())};;;;`)
	}

	lines.push('END:VCARD')
	return lines.join('\n')
}

export function validateVCard (payload: VCardPayload): string | null {
	try {
		serializeVCard(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректная визитка'
	}
}
