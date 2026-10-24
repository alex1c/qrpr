/**
 * Encode → matrix ImageData → jsQR decode roundtrips.
 * Independent of serializer internals beyond the final string payload.
 */
import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { matrixToImageData } from '@/lib/qr/render-canvas'
import { renderQrSvg } from '@/lib/qr/render-svg'
import { serializeWifi } from '@/lib/qr/serializers/wifi'
import { serializeVCard } from '@/lib/qr/serializers/vcard'
import { serializeWhatsApp } from '@/lib/qr/serializers/whatsapp'
import { serializeUrl } from '@/lib/qr/serializers/url'

function decodePayload (payload: string, ecc: 'L' | 'M' | 'Q' | 'H' = 'M'): string | null {
	const imageData = matrixToImageData(payload, {
		errorCorrection: ecc,
		margin: 2,
		scale: 8,
	})
	const code = jsQR(imageData.data, imageData.width, imageData.height, {
		inversionAttempts: 'dontInvert',
	})
	return code?.data ?? null
}

describe('encode → decode roundtrip', () => {
	it('roundtrips URL', () => {
		const payload = serializeUrl('https://qr-pr.ru/generator')
		expect(decodePayload(payload, 'M')).toBe(payload)
	})

	it('roundtrips unicode text', () => {
		const payload = 'Привет, QR-PR! 你好'
		expect(decodePayload(payload, 'Q')).toBe(payload)
	})

	it('roundtrips wifi payload', () => {
		const payload = serializeWifi({
			ssid: 'TestNet',
			password: 'secret;1',
			encryption: 'WPA',
			hidden: false,
		})
		expect(decodePayload(payload, 'M')).toBe(payload)
	})

	it('roundtrips vcard', () => {
		const payload = serializeVCard({
			firstName: 'Anna',
			lastName: 'Ivanova',
			organization: 'QR-PR',
			title: 'Dev',
			phone: '+79990001122',
			email: 'anna@example.com',
			url: 'https://example.com',
			address: 'Moscow',
		})
		expect(decodePayload(payload, 'Q')).toBe(payload)
	})

	it('roundtrips whatsapp link', () => {
		const payload = serializeWhatsApp({
			phone: '79991234567',
			message: 'Hello',
		})
		expect(decodePayload(payload, 'M')).toBe(payload)
	})

	it('works for multiple ECC levels', () => {
		const payload = 'https://example.com/ecc-test'
		for (const ecc of ['L', 'M', 'Q', 'H'] as const) {
			expect(decodePayload(payload, ecc)).toBe(payload)
		}
	})
})

describe('SVG export structure', () => {
	it('returns vector svg markup', () => {
		const svg = renderQrSvg('https://qr-pr.ru', {
			fgColor: '#0F172A',
			bgColor: '#FFFFFF',
			transparentBackground: false,
			size: 256,
			margin: 2,
			errorCorrection: 'M',
			dotStyle: 'square',
			eyeStyle: 'square',
		})
		expect(svg.startsWith('<svg')).toBe(true)
		expect(svg).toContain('viewBox=')
		expect(svg).not.toContain('<image href="data:image/png')
	})

	it('can embed logo as image href', () => {
		const svg = renderQrSvg('https://qr-pr.ru', {
			fgColor: '#000000',
			bgColor: '#FFFFFF',
			transparentBackground: false,
			size: 256,
			margin: 2,
			errorCorrection: 'H',
			dotStyle: 'rounded',
			eyeStyle: 'rounded',
			logoDataUrl: 'data:image/png;base64,abc',
			logoSizeRatio: 0.2,
		})
		expect(svg).toContain('<image ')
	})
})
