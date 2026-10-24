/**
 * Shared escaping helpers for QR payload serialization.
 */

/** Escape special characters in WIFI: QR payloads per common WIFI:WIFI format. */
export function escapeWifiValue(value: string): string {
	return value.replace(/([\\;,:"])/g, '\\$1')
}

/** Escape text for vCard 3.0 property values. */
export function escapeVCardValue(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/\r\n|\n|\r/g, '\\n')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
}

/** Escape text for iCalendar (ICS) TEXT properties. */
export function escapeIcalText(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r\n|\n|\r/g, '\\n')
}

/** Fold content lines at 75 UTF-8 octets, including the continuation space. */
export function foldIcalLine(line: string): string {
	const encoder = new TextEncoder()
	const parts: string[] = []
	let current = ''
	let bytes = 0
	for (const char of line) {
		const length = encoder.encode(char).length
		if (bytes + length > 75) {
			parts.push(current)
			current = ' '
			bytes = 1
		}
		current += char
		bytes += length
	}
	parts.push(current)
	return parts.join('\r\n')
}
