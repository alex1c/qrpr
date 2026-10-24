/**
 * Plain-text QR payload — preserves Unicode and newlines.
 */

export function serializeText (text: string): string {
	return text
}

export function validateText (text: string): string | null {
	if (!text.trim()) {
		return 'Введите текст'
	}
	// Soft limit to keep QR scannable (version growth).
	if (text.length > 2000) {
		return 'Текст слишком длинный для удобного сканирования (макс. 2000 символов)'
	}
	return null
}
