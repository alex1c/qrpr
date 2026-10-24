import { describe, expect, it } from 'vitest'
import { escapeWifiValue, escapeVCardValue, escapeIcalText } from '@/lib/qr/escape'
import { normalizeUrl, serializeUrl } from '@/lib/qr/serializers/url'
import { serializeText, validateText } from '@/lib/qr/serializers/text'
import { serializeWifi } from '@/lib/qr/serializers/wifi'
import { serializeVCard } from '@/lib/qr/serializers/vcard'
import { serializeEmail } from '@/lib/qr/serializers/email'
import { serializePhone, normalizePhone } from '@/lib/qr/serializers/phone'
import { serializeSms } from '@/lib/qr/serializers/sms'
import { serializeTelegram } from '@/lib/qr/serializers/telegram'
import { serializeWhatsApp } from '@/lib/qr/serializers/whatsapp'
import { serializeLocation, validateCoordinates } from '@/lib/qr/serializers/location'
import { serializeEvent, toIcalUtc } from '@/lib/qr/serializers/event'
import { serializeQrPayload } from '@/lib/qr/serializers'

describe('URL serialization', () => {
	it('normalizes bare domains with https', () => {
		const result = normalizeUrl('example.com/path?x=1')
		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.value).toBe('https://example.com/path?x=1')
		}
	})

	it('preserves https URLs', () => {
		expect(serializeUrl('https://qr-pr.ru/docs')).toBe('https://qr-pr.ru/docs')
	})

	it('rejects non-http schemes', () => {
		const result = normalizeUrl('javascript:alert(1)')
		expect(result.ok).toBe(false)
	})

	it('handles empty input', () => {
		expect(normalizeUrl('').ok).toBe(false)
	})
})

describe('Text', () => {
	it('preserves unicode and newlines', () => {
		const text = 'Привет\nмир 🎉'
		expect(serializeText(text)).toBe(text)
	})

	it('rejects empty and overly long text', () => {
		expect(validateText('   ')).toBeTruthy()
		expect(validateText('a'.repeat(2001))).toBeTruthy()
	})
})

describe('Wi-Fi', () => {
	it('escapes special characters', () => {
		expect(escapeWifiValue('a;b\\c,d"e')).toBe('a\\;b\\\\c\\,d\\"e')
	})

	it('serializes WPA network', () => {
		const out = serializeWifi({
			ssid: 'Cafe;1',
			password: 'p@ss;1',
			encryption: 'WPA',
			hidden: false,
		})
		expect(out).toContain('WIFI:')
		expect(out).toContain('T:WPA')
		expect(out).toContain('S:Cafe\\;1')
		expect(out).toContain('P:p@ss\\;1')
		expect(out).toContain('H:false')
	})

	it('allows open network without password', () => {
		const out = serializeWifi({
			ssid: 'Open',
			password: '',
			encryption: 'nopass',
			hidden: true,
		})
		expect(out).toContain('T:nopass')
		expect(out).toContain('H:true')
	})
})

describe('vCard', () => {
	it('escapes commas and semicolons', () => {
		expect(escapeVCardValue('A;B,C')).toBe('A\\;B\\,C')
	})

	it('requires a name', () => {
		expect(() =>
			serializeVCard({
				firstName: '',
				lastName: '',
				organization: '',
				title: '',
				phone: '',
				email: '',
				url: '',
				address: '',
			}),
		).toThrow()
	})

	it('builds valid structure', () => {
		const card = serializeVCard({
			firstName: 'Иван',
			lastName: 'Петров',
			organization: 'ООО "Ромашка"',
			title: 'Инженер',
			phone: '+79991234567',
			email: 'ivan@example.com',
			url: 'https://example.com',
			address: 'Москва, ул. Пример, 1',
		})
		expect(card).toContain('BEGIN:VCARD')
		expect(card).toContain('VERSION:3.0')
		expect(card).toContain('END:VCARD')
		expect(card).toContain('Иван')
	})
})

describe('mailto / phone / sms', () => {
	it('builds mailto with subject and body', () => {
		const out = serializeEmail({
			address: 'a@b.co',
			subject: 'Тема',
			body: 'Текст письма',
		})
		expect(out.startsWith('mailto:a@b.co?')).toBe(true)
		expect(out).toContain('subject=')
		expect(out).toContain('body=')
	})

	it('preserves international phone prefix', () => {
		expect(normalizePhone('+7 (999) 123-45-67')).toBe('+79991234567')
		expect(serializePhone('+79991234567')).toBe('tel:+79991234567')
	})

	it('serializes sms uri', () => {
		const out = serializeSms({ phone: '+79991234567', message: 'привет' })
		expect(out.startsWith('sms:+79991234567')).toBe(true)
		expect(out).toContain('body=')
	})
})

describe('Telegram / WhatsApp', () => {
	it('accepts username and t.me links', () => {
		expect(serializeTelegram('@durov')).toBe('https://t.me/durov')
		expect(serializeTelegram('https://t.me/durov')).toContain('t.me/durov')
	})

	it('builds wa.me links', () => {
		expect(serializeWhatsApp({ phone: '+7 999 123-45-67', message: '' })).toBe(
			'https://wa.me/79991234567',
		)
		expect(
			serializeWhatsApp({ phone: '79991234567', message: 'Hi' }),
		).toContain('text=Hi')
	})
})

describe('Location / Event', () => {
	it('validates coordinate ranges', () => {
		expect(validateCoordinates(55, 37)).toBeNull()
		expect(validateCoordinates(100, 0)).toBeTruthy()
		expect(validateCoordinates(0, 200)).toBeTruthy()
	})

	it('serializes map link', () => {
		const out = serializeLocation({ latitude: 55.75, longitude: 37.61 })
		expect(out).toContain('openstreetmap.org')
		expect(out).toContain('55.75')
	})

	it('escapes ical text and builds event', () => {
		expect(escapeIcalText('a;b,c\nd')).toBe('a\\;b\\,c\\nd')
		const start = '2026-10-24T10:00'
		const end = '2026-10-24T11:00'
		expect(toIcalUtc(start)).toMatch(/^\d{8}T\d{6}Z$/)
		const ics = serializeEvent({
			title: 'Встреча; тест',
			start,
			end,
			description: 'Описание\nстрока',
			location: 'Москва',
		})
		expect(ics).toContain('BEGIN:VCALENDAR')
		expect(ics).toContain('BEGIN:VEVENT')
		expect(ics).toContain('SUMMARY:')
	})
})

describe('PDF link + unified API', () => {
	it('requires https for pdf tool', () => {
		expect(() =>
			serializeQrPayload('pdf', { url: 'http://example.com/a.pdf' }),
		).toThrow(/HTTPS/)
		expect(serializeQrPayload('pdf', { url: 'https://example.com/a.pdf' })).toContain(
			'https://',
		)
	})

	it('handles empty wifi ssid via unified validate path', () => {
		expect(() =>
			serializeQrPayload('wifi', {
				ssid: '',
				password: 'x',
				encryption: 'WPA',
				hidden: false,
			}),
		).toThrow()
	})
})
