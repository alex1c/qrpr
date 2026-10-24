import type { Metadata, Viewport } from 'next'
import { Manrope, Onest, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { JsonLd, softwareApplicationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld'
import { defaultMetadata } from '@/lib/seo/metadata'
import { SITE_LOCALE, SITE_NAME, SITE_URL } from '@/config/site'
import './globals.css'

const manrope = Manrope({
	variable: '--font-sans',
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

const onest = Onest({
	variable: '--font-display',
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

const jetbrains = JetBrains_Mono({
	variable: '--font-mono',
	subsets: ['latin', 'cyrillic'],
	display: 'swap',
})

export const metadata: Metadata = {
	...defaultMetadata,
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — бесплатный генератор QR-кодов`,
		template: `%s · ${SITE_NAME}`,
	},
	applicationName: SITE_NAME,
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	formatDetection: {
		telephone: false,
		email: false,
		address: false,
	},
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f4f7f6' },
		{ media: '(prefers-color-scheme: dark)', color: '#0b1412' },
	],
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout ({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang={SITE_LOCALE}
			suppressHydrationWarning
			className={`${manrope.variable} ${onest.variable} ${jetbrains.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<ThemeProvider>
					<JsonLd data={websiteJsonLd()} />
					<JsonLd data={softwareApplicationJsonLd()} />
					<a
						href="#main"
						className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-white"
					>
						Перейти к содержимому
					</a>
					<Header />
					<main id="main" className="flex-1">
						{children}
					</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
