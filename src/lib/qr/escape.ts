/**
 * Shared escaping helpers for QR payload serialization.
 */

/** Escape special characters in WIFI: QR payloads per common WIFI:WIFI format. */
export function escapeWifiValue (value: string): string {
	return value.replace(/([\\;,:"])/g, '\\$1')
}

/** Escape text for vCard 3.0 property values. */
export function escapeVCardValue (value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
}

/** Escape text for iCalendar (ICS) TEXT properties. */
export function escapeIcalText (value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r\n|\n|\r/g, '\\n')
}

/** Fold long ICS lines to 75 octets (approx via UTF-16 length for MVP). */
export function foldIcalLine (line: string): string {
	const max = 75
	if (line.length <= max) {
		return line
	}
	const parts: string[] = []
	let remaining = line
	parts.push(remaining.slice(0, max))
	remaining = remaining.slice(max)
	while (remaining.length > 0) {
		parts.push(` ${remaining.slice(0, max - 1)}`)
		remaining = remaining.slice(max - 1)
	}
	return parts.join('\r\n')
}
