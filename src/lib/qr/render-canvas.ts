/**
 * Canvas renderer for PNG export and clipboard copy.
 * Browser-only — call from client components.
 */
import { renderQrSvg } from '@/lib/qr/render-svg'
import { encodeMatrix } from '@/lib/qr/encode-matrix'
import type { DotStyle, ErrorCorrectionLevel, EyeStyle } from '@/types/qr'

export interface CanvasRenderOptions {
	fgColor: string
	bgColor: string
	transparentBackground: boolean
	size: number
	margin: number
	errorCorrection: ErrorCorrectionLevel
	dotStyle: DotStyle
	eyeStyle: EyeStyle
	logoDataUrl?: string | null
	logoSizeRatio?: number
}

/** Rasterize the same SVG used in preview, preserving styles and logo aspect ratio. */
export async function renderQrToCanvas(
	value: string,
	options: CanvasRenderOptions,
	target?: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
	const svg = renderQrSvg(value, options)
	const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
	try {
		const image = await new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image()
			img.onload = () => resolve(img)
			img.onerror = () => reject(new Error('Не удалось отрисовать QR'))
			img.src = url
		})
		const canvas = target ?? document.createElement('canvas')
		canvas.width = options.size
		canvas.height = options.size
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('Canvas 2D недоступен')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(image, 0, 0)
		return canvas
	} finally {
		URL.revokeObjectURL(url)
	}
}

/**
 * Simple monochrome bitmap for roundtrip tests.
 * Returns an ImageData-compatible object (works in browsers and jsdom/Node).
 * Uses only square modules — no styling.
 */
export function matrixToImageData(
	value: string,
	options: {
		errorCorrection?: ErrorCorrectionLevel
		margin?: number
		scale?: number
	} = {},
): { data: Uint8ClampedArray; width: number; height: number } {
	const matrix = encodeMatrix(value, {
		errorCorrection: options.errorCorrection ?? 'M',
		margin: options.margin ?? 2,
	})
	const scale = options.scale ?? 4
	const width = matrix.size * scale
	const data = new Uint8ClampedArray(width * width * 4)

	for (let row = 0; row < matrix.size; row += 1) {
		for (let col = 0; col < matrix.size; col += 1) {
			const dark = matrix.data[row][col]
			const color = dark ? 0 : 255
			for (let dy = 0; dy < scale; dy += 1) {
				for (let dx = 0; dx < scale; dx += 1) {
					const x = col * scale + dx
					const y = row * scale + dy
					const idx = (y * width + x) * 4
					data[idx] = color
					data[idx + 1] = color
					data[idx + 2] = color
					data[idx + 3] = 255
				}
			}
		}
	}

	// Prefer native ImageData when available; otherwise return a plain shim for jsQR.
	if (typeof ImageData !== 'undefined') {
		return new ImageData(data, width, width)
	}
	return { data, width, height: width }
}
