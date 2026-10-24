'use client'

/**
 * Client analytics shell: consent banner + conditional Metrika.
 */
import { AnalyticsConsentBanner } from '@/components/analytics/consent-banner'
import { YandexMetrika } from '@/components/analytics/yandex-metrika'

export function AnalyticsProvider () {
	return (
		<>
			<YandexMetrika />
			<AnalyticsConsentBanner />
		</>
	)
}
