/**
 * Subscribeable analytics consent for useSyncExternalStore.
 */
import { ANALYTICS_CONSENT_STORAGE_KEY } from '@/config/site'
import {
	ANALYTICS_CONSENT_EVENT,
	type AnalyticsConsent,
} from '@/lib/analytics/consent'

export function subscribeAnalyticsConsent (onStoreChange: () => void): () => void {
	window.addEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange)
	window.addEventListener('storage', onStoreChange)
	return () => {
		window.removeEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange)
		window.removeEventListener('storage', onStoreChange)
	}
}

export function getAnalyticsConsentSnapshot (): AnalyticsConsent | null {
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

export function getAnalyticsConsentServerSnapshot (): AnalyticsConsent | null {
	return null
}
