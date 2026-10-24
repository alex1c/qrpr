'use client'

/**
 * Optional analytics consent UI.
 * Metrika scripts load only after an explicit "accept".
 * Denial is persisted and respected until the user changes their choice.
 */
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { writeAnalyticsConsent } from '@/lib/analytics/consent'
import {
	getAnalyticsConsentServerSnapshot,
	getAnalyticsConsentSnapshot,
	subscribeAnalyticsConsent,
} from '@/lib/analytics/consent-store'

export function AnalyticsConsentBanner () {
	const consent = useSyncExternalStore(
		subscribeAnalyticsConsent,
		getAnalyticsConsentSnapshot,
		getAnalyticsConsentServerSnapshot,
	)

	// Hide until hydrated decision is known as undecided (null).
	// Server snapshot is null — banner would flash; suppress until client mount
	// by checking typeof window via a second store for "hasHydrated".
	const hydrated = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	)

	if (!hydrated || consent !== null) {
		return null
	}

	return (
		<div
			role="dialog"
			aria-labelledby="analytics-consent-title"
			aria-describedby="analytics-consent-desc"
			className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_-8px_30px_rgba(15,31,28,0.12)] sm:p-5"
		>
			<div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="max-w-2xl space-y-2">
					<p
						id="analytics-consent-title"
						className="text-sm font-semibold text-[var(--ink)]"
					>
						Аналитика cookies
					</p>
					<p
						id="analytics-consent-desc"
						className="text-sm leading-relaxed text-[var(--ink-muted)]"
					>
						Мы можем подключить Яндекс Метрику, чтобы понимать, как пользуются
						сайтом (просмотры страниц и переходы). Счётчик не загружается, пока
						вы не согласитесь. Содержимое QR-кодов и полей генератора в Метрику
						не передаём. Подробнее — в{' '}
						<Link
							href="/privacy"
							className="text-[var(--accent)] underline-offset-2 hover:underline"
						>
							политике конфиденциальности
						</Link>
						. Выбор можно изменить позже.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						type="button"
						variant="secondary"
						onClick={() => writeAnalyticsConsent('denied')}
					>
						Отказаться
					</Button>
					<Button
						type="button"
						onClick={() => writeAnalyticsConsent('granted')}
					>
						Принять
					</Button>
				</div>
			</div>
		</div>
	)
}

/**
 * Compact controls for privacy page — change prior decision.
 */
export function AnalyticsConsentControls () {
	const consent = useSyncExternalStore(
		subscribeAnalyticsConsent,
		getAnalyticsConsentSnapshot,
		getAnalyticsConsentServerSnapshot,
	)

	const status =
		consent === 'granted'
			? 'принято'
			: consent === 'denied'
				? 'отклонено'
				: 'не выбрано'

	return (
		<div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
			<p className="text-sm text-[var(--ink)]">
				Согласие на Яндекс Метрику: <strong>{status}</strong>
			</p>
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					size="sm"
					onClick={() => writeAnalyticsConsent('granted')}
				>
					Разрешить аналитику
				</Button>
				<Button
					type="button"
					size="sm"
					variant="secondary"
					onClick={() => writeAnalyticsConsent('denied')}
				>
					Отключить аналитику
				</Button>
			</div>
		</div>
	)
}
