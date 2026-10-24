/**
 * iCalendar (VEVENT) serialization for calendar QR codes.
 * Compatibility varies across calendar apps — not guaranteed universally.
 */
import { escapeIcalText, foldIcalLine } from '@/lib/qr/escape'
import type { EventPayload } from '@/types/qr'

/**
 * Convert datetime-local / ISO-ish input to UTC iCal form YYYYMMDDTHHMMSSZ.
 */
export function toIcalUtc (input: string): string {
	const date = new Date(input)
	if (Number.isNaN(date.getTime())) {
		throw new Error('Некорректная дата')
	}
	const pad = (n: number) => String(n).padStart(2, '0')
	return (
		`${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
		`T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
	)
}

export function serializeEvent (payload: EventPayload): string {
	const title = payload.title.trim()
	if (!title) {
		throw new Error('Укажите название события')
	}
	if (!payload.start.trim()) {
		throw new Error('Укажите время начала')
	}
	if (!payload.end.trim()) {
		throw new Error('Укажите время окончания')
	}

	const dtStart = toIcalUtc(payload.start)
	const dtEnd = toIcalUtc(payload.end)
	if (new Date(payload.end).getTime() < new Date(payload.start).getTime()) {
		throw new Error('Окончание не может быть раньше начала')
	}

	const stamp = toIcalUtc(new Date().toISOString())
	const uid = `qr-pr-${dtStart}-${Math.abs(hashString(title))}@qr-pr.ru`

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//QR-PR//RU',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'BEGIN:VEVENT',
		`UID:${uid}`,
		`DTSTAMP:${stamp}`,
		`DTSTART:${dtStart}`,
		`DTEND:${dtEnd}`,
		foldIcalLine(`SUMMARY:${escapeIcalText(title)}`),
	]

	if (payload.description.trim()) {
		lines.push(foldIcalLine(`DESCRIPTION:${escapeIcalText(payload.description.trim())}`))
	}
	if (payload.location.trim()) {
		lines.push(foldIcalLine(`LOCATION:${escapeIcalText(payload.location.trim())}`))
	}

	lines.push('END:VEVENT', 'END:VCALENDAR')
	return lines.join('\r\n')
}

function hashString (value: string): number {
	let hash = 0
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i)
		hash |= 0
	}
	return hash
}

export function validateEvent (payload: EventPayload): string | null {
	try {
		serializeEvent(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректное событие'
	}
}
