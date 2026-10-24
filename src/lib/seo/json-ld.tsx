/**
 * JSON-LD helpers for structured data (WebSite, SoftwareApplication, FAQ, Breadcrumb).
 */
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import { absoluteUrl } from '@/lib/seo/metadata'

export function websiteJsonLd () {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		inLanguage: 'ru-RU',
	}
}

export function softwareApplicationJsonLd () {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: SITE_NAME,
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'Web',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'RUB',
		},
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		inLanguage: 'ru-RU',
	}
}

export function breadcrumbJsonLd (
	items: Array<{ name: string; path: string }>,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	}
}

export function faqJsonLd (
	items: Array<{ question: string; answer: string }>,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	}
}

export function JsonLd ({
	data,
}: {
	data: Record<string, unknown> | Array<Record<string, unknown>>
}) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
		/>
	)
}
