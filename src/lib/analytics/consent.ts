/**
 * Analytics consent helpers (localStorage).
 * Values: granted | denied. Missing key means undecided.
 */
import { ANALYTICS_CONSENT_STORAGE_KEY } from '@/config/site'

export type AnalyticsConsent = 'granted' | 'denied'

export const ANALYTICS_CONSENT_EVENT = 'qr-pr-analytics-consent'

export function readAnalyticsConsent (): AnalyticsConsent | null {
	if (typeof window === 'undefined') {
		return null
	}
	try {
		const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
		if (value === 'granted' || value === 'denied') {
			return value
		}
		return null
	} catch {
		return null
	}
}

export function writeAnalyticsConsent (value: AnalyticsConsent): void {
	if (typeof window === 'undefined') {
		return
	}
	try {
		window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value)
	} catch {
		// Private mode / blocked storage — still notify in-memory listeners.
	}
	window.dispatchEvent(
		new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }),
	)
}

export function clearAnalyticsConsent (): void {
	if (typeof window === 'undefined') {
		return
	}
	try {
		window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
	} catch {
		// ignore
	}
	window.dispatchEvent(
		new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null }),
	)
}
