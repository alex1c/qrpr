import type { NextConfig } from 'next'
import { YANDEX_METRIKA_ORIGINS } from './src/config/analytics'

const metrikaOrigins = YANDEX_METRIKA_ORIGINS.join(' ')
const isDev = process.env.NODE_ENV === 'development'

/**
 * CSP allows only the Metrika endpoints needed for tag.js + collect beacons.
 * Webvisor/clickmap are disabled in app config, so we do not widen frame permissions.
 */
const contentSecurityPolicy = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} ${metrikaOrigins}`,
	"style-src 'self' 'unsafe-inline'",
	`img-src 'self' data: blob: ${metrikaOrigins}`,
	"font-src 'self'",
	`connect-src 'self' ${metrikaOrigins}`,
	"media-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
	output: 'standalone',
	async headers () {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(self), microphone=(), geolocation=()',
					},
					{
						key: 'Content-Security-Policy',
						value: contentSecurityPolicy,
					},
				],
			},
		]
	},
	cacheComponents: true,
	partialPrefetching: true,
	poweredByHeader: false,
	allowedDevOrigins: ['127.0.0.1', 'localhost'],

	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
}

export default nextConfig
