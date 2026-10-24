import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import {
	buildAnalyticsHitUrl,
	sanitizeAnalyticsPath,
} from '@/lib/analytics/metrika-url'
import {
	clearAnalyticsConsent,
	readAnalyticsConsent,
	writeAnalyticsConsent,
} from '@/lib/analytics/consent'
import { ANALYTICS_CONSENT_STORAGE_KEY } from '@/config/site'
import { YANDEX_METRIKA_OPTIONS, YANDEX_METRIKA_ID } from '@/config/analytics'

describe('analytics URL sanitization', () => {
	it('strips query and hash that may contain user data', () => {
		expect(
			sanitizeAnalyticsPath(
				'/generator',
				'?wifi=secret&phone=%2B7999',
				'#token=abc',
			),
		).toBe('/generator')
		expect(
			buildAnalyticsHitUrl(
				'https://qr-pr.ru',
				'/qr-wifi',
				'?ssid=Home&password=x',
			),
		).toBe('https://qr-pr.ru/qr-wifi')
	})

	it('normalizes empty path', () => {
		expect(sanitizeAnalyticsPath('')).toBe('/')
	})
})

describe('analytics consent storage', () => {
	beforeEach(() => {
		window.localStorage.clear()
	})

	afterEach(() => {
		window.localStorage.clear()
	})

	it('starts undecided', () => {
		expect(readAnalyticsConsent()).toBeNull()
	})

	it('persists grant and deny', () => {
		writeAnalyticsConsent('granted')
		expect(readAnalyticsConsent()).toBe('granted')
		expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe(
			'granted',
		)

		writeAnalyticsConsent('denied')
		expect(readAnalyticsConsent()).toBe('denied')
	})

	it('clear returns to undecided', () => {
		writeAnalyticsConsent('granted')
		clearAnalyticsConsent()
		expect(readAnalyticsConsent()).toBeNull()
	})

	it('dispatches consent events for listeners', () => {
		const handler = vi.fn()
		window.addEventListener('qr-pr-analytics-consent', handler)
		writeAnalyticsConsent('granted')
		expect(handler).toHaveBeenCalled()
		window.removeEventListener('qr-pr-analytics-consent', handler)
	})
})

describe('metrika options safety', () => {
	it('uses only the qr-pr.ru counter and keeps webvisor/clickmap off', () => {
		expect(YANDEX_METRIKA_ID).toBe(68948335)
		expect(YANDEX_METRIKA_OPTIONS.webvisor).toBe(false)
		expect(YANDEX_METRIKA_OPTIONS.clickmap).toBe(false)
		expect(YANDEX_METRIKA_OPTIONS.accurateTrackBounce).toBe(true)
		expect(YANDEX_METRIKA_OPTIONS.trackLinks).toBe(true)
		expect(YANDEX_METRIKA_OPTIONS.ecommerce).toBe(false)
	})
})

