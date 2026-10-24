/**
 * PNG export via canvas rendering.
 */
import { renderQrToCanvas, type CanvasRenderOptions } from '@/lib/qr/render-canvas'
import { downloadBlob } from '@/lib/export/download'
import { buildExportFilename } from '@/lib/export/filename'

export async function exportPng (
	value: string,
	options: CanvasRenderOptions,
	toolId: string,
): Promise<void> {
	const canvas = await renderQrToCanvas(value, options)
	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(result) => {
				if (!result) {
					reject(new Error('Не удалось создать PNG'))
					return
				}
				resolve(result)
			},
			'image/png',
		)
	})
	downloadBlob(blob, buildExportFilename(toolId, 'png'))
}

export async function canvasToPngBlob (canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(result) => {
				if (!result) {
					reject(new Error('Не удалось создать PNG'))
					return
				}
				resolve(result)
			},
			'image/png',
		)
	})
}
