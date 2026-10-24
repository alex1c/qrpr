/**
 * Client-side download helpers (blob URLs).
 */

export function downloadBlob (blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob)
	const anchor = document.createElement('a')
	anchor.href = url
	anchor.download = filename
	anchor.rel = 'noopener'
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
	URL.revokeObjectURL(url)
}

export function downloadDataUrl (dataUrl: string, filename: string): void {
	const anchor = document.createElement('a')
	anchor.href = dataUrl
	anchor.download = filename
	anchor.rel = 'noopener'
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
}
