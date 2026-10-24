/**
 * Sanitize page URLs before sending hits to Yandex Metrika.
 * Strips query string and hash so user data in params is never reported.
 */
export function sanitizeAnalyticsPath (
	pathname: string,
	search = '',
	hash = '',
): string {
	void search
	void hash
	const path = pathname.startsWith('/') ? pathname : `/${pathname}`
	// Never append search or hash — they may contain user-entered data.
	return path === '' ? '/' : path
}

/**
 * Build a same-origin analytics URL from the current location without query/hash.
 */
export function buildAnalyticsHitUrl (
	origin: string,
	pathname: string,
	search?: string,
	hash?: string,
): string {
	const path = sanitizeAnalyticsPath(pathname, search, hash)
	return `${origin.replace(/\/$/, '')}${path}`
}
