/**
 * Sitemap for all indexable marketing / tool pages.
 */
import type { MetadataRoute } from 'next'
import { EXTRA_TOOL_PAGES, QR_TOOLS } from '@/config/tools'
import { SITE_URL } from '@/config/site'

export default function sitemap (): MetadataRoute.Sitemap {
	const staticPaths = [
		'/',
		'/about',
		'/contact',
		'/privacy',
		'/terms',
		...QR_TOOLS.map((t) => t.href),
		...EXTRA_TOOL_PAGES.map((p) => p.href),
	]

	const unique = [...new Set(staticPaths)]

	const lastModified = new Date('2026-10-24')

	return unique.map((path) => ({
		url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
		lastModified,
		changeFrequency: path === '/' ? 'weekly' : 'monthly',
		priority: path === '/' ? 1 : path.includes('generator') || path.startsWith('/qr-') ? 0.8 : 0.5,
	}))
}
