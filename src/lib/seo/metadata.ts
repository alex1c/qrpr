/**
 * Shared Next.js metadata builders for QR-PR pages.
 */
import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'

export interface PageSeoInput {
	title: string
	description: string
	path: string
	noIndex?: boolean
}

export function absoluteUrl (path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`
	return `${SITE_URL}${normalized === '/' ? '' : normalized}`
}

export function buildPageMetadata (input: PageSeoInput): Metadata {
	const url = absoluteUrl(input.path)
	const fullTitle =
		input.title === SITE_NAME ? SITE_NAME : `${input.title} · ${SITE_NAME}`

	return {
		title: { absolute: fullTitle },
		description: input.description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			type: 'website',
			locale: 'ru_RU',
			url,
			siteName: SITE_NAME,
			title: fullTitle,
			description: input.description,
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description: input.description,
		},
		robots: input.noIndex
			? { index: false, follow: false }
			: { index: true, follow: true },
	}
}

export const defaultMetadata: Metadata = buildPageMetadata({
	title: SITE_NAME,
	description: SITE_DESCRIPTION,
	path: '/',
})
