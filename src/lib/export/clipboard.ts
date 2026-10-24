/**
 * Copy PNG to system clipboard when ClipboardItem API is available.
 */
import { renderQrToCanvas, type CanvasRenderOptions } from '@/lib/qr/render-canvas'
import { canvasToPngBlob } from '@/lib/export/png'

export function canCopyImage (): boolean {
	return (
		typeof navigator !== 'undefined' &&
		typeof ClipboardItem !== 'undefined' &&
		!!navigator.clipboard?.write
	)
}

export async function copyPngToClipboard (
	value: string,
	options: CanvasRenderOptions,
): Promise<void> {
	if (!canCopyImage()) {
		throw new Error('Буфер обмена для изображений не поддерживается в этом браузере')
	}
	const canvas = await renderQrToCanvas(value, options)
	const blob = await canvasToPngBlob(canvas)
	await navigator.clipboard.write([
		new ClipboardItem({ 'image/png': blob }),
	])
}

export async function copyTextToClipboard (text: string): Promise<void> {
	if (!navigator.clipboard?.writeText) {
		throw new Error('Буфер обмена недоступен')
	}
	await navigator.clipboard.writeText(text)
}
