import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'

export default function robots (): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			// Avoid indexing hypothetical future query-param duplicates
			disallow: ['/api/'],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	}
}
