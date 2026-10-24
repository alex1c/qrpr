'use client'

/**
 * next-themes provider — stores preference under THEME_STORAGE_KEY.
 */
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { THEME_STORAGE_KEY } from '@/config/site'

export function ThemeProvider ({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			storageKey={THEME_STORAGE_KEY}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	)
}
