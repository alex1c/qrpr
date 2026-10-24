/**
 * Telegram profile / channel / public chat QR serialization.
 * Private chats and invite-only resources are not guaranteed.
 */

const TELEGRAM_HOSTS = new Set([
	't.me',
	'www.t.me',
	'telegram.me',
	'www.telegram.me',
	'telegram.dog',
])

/**
 * Accept @username, username, or https://t.me/... link.
 */
export function serializeTelegram (value: string): string {
	const trimmed = value.trim()
	if (!trimmed) {
		throw new Error('Укажите username или ссылку Telegram')
	}

	// Full URL
	if (/^https?:\/\//i.test(trimmed)) {
		let url: URL
		try {
			url = new URL(trimmed)
		} catch {
			throw new Error('Некорректная ссылка Telegram')
		}
		if (!TELEGRAM_HOSTS.has(url.hostname.toLowerCase())) {
			throw new Error('Поддерживаются ссылки t.me / telegram.me')
		}
		return url.toString()
	}

	// tg:// resolve?domain=
	if (trimmed.toLowerCase().startsWith('tg://')) {
		return trimmed
	}

	const username = trimmed.replace(/^@/, '')
	if (!/^[a-zA-Z0-9_]{4,64}$/.test(username) && !/^[a-zA-Z0-9_+/=-]{10,}$/.test(username)) {
		// Allow invite hashes loosely via length; usernames 5+ typically
		if (!/^[a-zA-Z][a-zA-Z0-9_]{3,63}$/.test(username)) {
			throw new Error('Некорректный username Telegram')
		}
	}

	return `https://t.me/${username}`
}

export function validateTelegram (value: string): string | null {
	try {
		serializeTelegram(value)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректный Telegram'
	}
}
