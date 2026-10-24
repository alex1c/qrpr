import { describe, expect, it } from 'vitest'
import {
	analyzeUrl,
	canOfferOpen,
	detectContentType,
} from '@/lib/scanner/detect-type'

describe('content detection', () => {
	it('detects common types', () => {
		expect(detectContentType('https://a.com')).toBe('url')
		expect(detectContentType('WIFI:T:WPA;S:x;P:y;;')).toBe('wifi')
		expect(detectContentType('BEGIN:VCARD\nEND:VCARD')).toBe('vcard')
		expect(detectContentType('mailto:a@b.co')).toBe('email')
		expect(detectContentType('tel:+7999')).toBe('phone')
		expect(detectContentType('просто текст')).toBe('text')
	})

	it('blocks dangerous schemes for open', () => {
		expect(canOfferOpen('javascript:alert(1)')).toBe(false)
		expect(canOfferOpen('https://qr-pr.ru')).toBe(true)
	})

	it('flags suspicious url features without claiming safety', () => {
		const analysis = analyzeUrl('https://user:pass@192.168.0.1/x')
		expect(analysis.isValidUrl).toBe(true)
		expect(analysis.warnings.length).toBeGreaterThan(0)
		expect(
			analysis.warnings.some((w) => w.includes('не проверяет репутацию')),
		).toBe(true)
	})
})
