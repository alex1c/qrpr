import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { serializeQrPayload } from '@/lib/qr/serializers'
import { matrixToImageData } from '@/lib/qr/render-canvas'
import { escapeVCardValue, foldIcalLine } from '@/lib/qr/escape'
import { renderQrSvg } from '@/lib/qr/render-svg'
import { DEFAULT_STYLE } from '@/lib/qr/presets'
import { toIcalUtc } from '@/lib/qr/serializers/event'

export const cases = [
	['url', { url: 'https://пример.рф:8443/путь?q=a%26b#раздел' }],
	['text', { text: 'Привет\n你好 🎉' }],
	[
		'wifi',
		{
			ssid: '  сеть;,:"\\ ',
			password: ' x;,:"\\ ',
			encryption: 'WPA',
			hidden: true,
		},
	],
	[
		'vcard',
		{
			firstName: 'Иван\r\nТест',
			lastName: 'Фамилия;',
			organization: 'Организация',
			title: 'Инженер',
			phone: '+79991234567',
			email: 'a@example.com',
			url: 'https://example.com',
			address: 'Москва, дом 1',
		},
	],
	[
		'email',
		{
			address: 'a+test@example.com',
			subject: 'Тема & +',
			body: 'Первая строка\nВторая строка',
		},
	],
	['phone', { phone: '+7 (999) 123-45-67' }],
	['sms', { phone: '+79991234567', message: 'Привет & + ?\nстрока' }],
	['telegram', { value: 'https://t.me/+Abcdef123456' }],
	['whatsapp', { phone: '+79991234567', message: 'Привет & + ?' }],
	['location', { latitude: -90, longitude: 180 }],
	[
		'event',
		{
			title: 'Встреча; 📅',
			start: '2026-10-24T10:00:00+03:00',
			end: '2026-10-24T11:00:00+03:00',
			description: 'Описание\nстрока',
			location: 'Москва',
		},
	],
	['pdf', { url: 'https://example.com/a.pdf?x=1&y=2' }],
] as const

describe('independent jsQR decoder: all twelve serializers', () => {
	for (const [type, payload] of cases) {
		it(type, () => {
			const raw = serializeQrPayload(type, payload as never)
			const image = matrixToImageData(raw, {
				margin: 4,
				scale: 6,
				errorCorrection: 'M',
			})
			expect(jsQR(image.data, image.width, image.height)?.data).toBe(raw)
		})
	}
	it('preserves exact SSID and escapes line injection', () => {
		expect(
			serializeQrPayload('wifi', {
				ssid: ' x ',
				password: ' y ',
				encryption: 'WPA',
				hidden: true,
			}),
		).toContain('S: x ;P: y ;')
		expect(escapeVCardValue('a\r\nb\rc\nd')).toBe('a\\nb\\nc\\nd')
	})
	it('folds Unicode by UTF-8 bytes without breaking code points', () => {
		const value = 'SUMMARY:' + 'я🎉'.repeat(60)
		const folded = foldIcalLine(value)
		expect(folded.replace(/\r\n /g, '')).toBe(value)
		for (const line of folded.split('\r\n'))
			expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
	})
	it('encodes mail URI spaces and reserved address characters', () => {
		expect(
			serializeQrPayload('email', {
				address: 'a?x@example.com',
				subject: 'a b+',
				body: 'a\nb',
			}),
		).toBe('mailto:a%3Fx@example.com?subject=a%20b%2B&body=a%0Ab')
	})
	it('converts explicit timezone to UTC', () => {
		expect(toIcalUtc('2026-10-24T10:00:00+03:00')).toBe('20261024T070000Z')
	})
	it('rejects unsafe SVG attributes and non-raster logos', () => {
		expect(() =>
			renderQrSvg('hello', {
				...DEFAULT_STYLE,
				fgColor: '"><script>alert(1)</script>',
			}),
		).toThrow()
		expect(() =>
			renderQrSvg('hello', {
				...DEFAULT_STYLE,
				logoDataUrl: 'data:image/svg+xml,<svg onload="alert(1)"/>',
			}),
		).toThrow()
	})
})

it('validates calendar dates and nonstandard HTTP URLs', () => {
	expect(() => toIcalUtc('2026-02-30T10:00')).toThrow()
	expect(serializeQrPayload('url', { url: 'localhost:8080/a' })).toBe(
		'https://localhost:8080/a',
	)
	expect(serializeQrPayload('url', { url: 'example.com:8080/a' })).toBe(
		'https://example.com:8080/a',
	)
	expect(serializeQrPayload('url', { url: '//example.com/a' })).toBe(
		'https://example.com/a',
	)
})

import { decodeHtmlImage } from '@/lib/scanner/decode'
it('rejects excessive decoded pixel count before allocating canvas', async () => {
	await expect(
		decodeHtmlImage({ width: 10000, height: 10000 } as ImageBitmap),
	).rejects.toThrow('слишком большое')
})
