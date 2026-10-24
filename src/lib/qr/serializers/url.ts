/**
 * URL / HTTPS document link serialization for static QR codes.
 * Does not rewrite user URLs unexpectedly — only light normalization when asked.
 */

export interface NormalizeUrlOptions {
	/** When true, prepend https:// if scheme is missing. Default true for UX. */
	addHttpsIfMissing?: boolean
}

/**
 * Normalize a user-entered URL for QR encoding.
 * Preserves path, query, and hash. Does not strip trailing slashes.
 */
export function normalizeUrl(
	raw: string,
	options: NormalizeUrlOptions = {},
): { ok: true; value: string } | { ok: false; error: string } {
	const trimmed = raw.trim()
	if (!trimmed) {
		return { ok: false, error: 'Введите ссылку' }
	}

	const { addHttpsIfMissing = true } = options
	let candidate = trimmed
	if (candidate.startsWith('//')) candidate = `https:${candidate}`
	if (/^(?:localhost|[^/:?#]+\.[^/:?#]+):\d+(?:[/?#]|$)/i.test(candidate))
		candidate = `https://${candidate}`

	// Allow scheme-relative-ish input like example.com/path
	if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
		if (!addHttpsIfMissing) {
			return {
				ok: false,
				error: 'Укажите полный URL со схемой http:// или https://',
			}
		}
		candidate = `https://${candidate}`
	}

	let parsed: URL
	try {
		parsed = new URL(candidate)
	} catch {
		return { ok: false, error: 'Некорректный URL' }
	}

	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		return { ok: false, error: 'Поддерживаются только HTTP и HTTPS' }
	}

	if (!parsed.hostname) {
		return { ok: false, error: 'В URL отсутствует хост' }
	}

	return { ok: true, value: parsed.toString() }
}

export function serializeUrl(raw: string): string {
	const result = normalizeUrl(raw)
	if (!result.ok) {
		throw new Error(result.error)
	}
	return result.value
}
