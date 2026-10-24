/**
 * Canvas renderer for PNG export and clipboard copy.
 * Browser-only — call from client components.
 */
import { encodeMatrix, QrCodeDataType } from '@/lib/qr/encode-matrix'
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

function isInFinderPattern (row: number, col: number, size: number, margin: number): boolean {
	const core = size - margin * 2
	const inTopLeft = row < margin + 7 && col < margin + 7
	const inTopRight = row < margin + 7 && col >= margin + core - 7
	const inBottomLeft = row >= margin + core - 7 && col < margin + 7
	return inTopLeft || inTopRight || inBottomLeft
}

function drawModule (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	module: number,
	style: DotStyle,
): void {
	const pad = style === 'dots' ? module * 0.2 : style === 'rounded' ? module * 0.05 : 0
	const w = module - pad * 2
	const cx = x + pad
	const cy = y + pad
	if (style === 'dots') {
		ctx.beginPath()
		ctx.arc(cx + w / 2, cy + w / 2, w / 2, 0, Math.PI * 2)
		ctx.fill()
		return
	}
	const rx = style === 'rounded' ? module * 0.25 : 0
	if (rx === 0) {
		ctx.fillRect(cx, cy, w, w)
		return
	}
	roundRect(ctx, cx, cy, w, w, rx)
	ctx.fill()
}

function roundRect (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
): void {
	ctx.beginPath()
	ctx.moveTo(x + r, y)
	ctx.arcTo(x + w, y, x + w, y + h, r)
	ctx.arcTo(x + w, y + h, x, y + h, r)
	ctx.arcTo(x, y + h, x, y, r)
	ctx.arcTo(x, y, x + w, y, r)
	ctx.closePath()
}

function drawEye (
	ctx: CanvasRenderingContext2D,
	originX: number,
	originY: number,
	module: number,
	style: EyeStyle,
	fg: string,
	bg: string,
): void {
	const outerR = style === 'square' ? 0 : style === 'rounded' ? module : module * 1.5
	const midR = style === 'square' ? 0 : style === 'rounded' ? module * 0.7 : module
	const innerR = style === 'square' ? 0 : style === 'rounded' ? module * 0.4 : module * 0.5

	ctx.fillStyle = fg
	if (outerR === 0) {
		ctx.fillRect(originX, originY, 7 * module, 7 * module)
	} else {
		roundRect(ctx, originX, originY, 7 * module, 7 * module, outerR)
		ctx.fill()
	}

	ctx.fillStyle = bg
	if (midR === 0) {
		ctx.fillRect(originX + module, originY + module, 5 * module, 5 * module)
	} else {
		roundRect(ctx, originX + module, originY + module, 5 * module, 5 * module, midR)
		ctx.fill()
	}

	ctx.fillStyle = fg
	if (innerR === 0) {
		ctx.fillRect(originX + 2 * module, originY + 2 * module, 3 * module, 3 * module)
	} else {
		roundRect(
			ctx,
			originX + 2 * module,
			originY + 2 * module,
			3 * module,
			3 * module,
			innerR,
		)
		ctx.fill()
	}
}

function loadImage (src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось загрузить логотип'))
		img.src = src
	})
}

/**
 * Draw QR onto a canvas element (or offscreen canvas) and return it.
 */
export async function renderQrToCanvas (
	value: string,
	options: CanvasRenderOptions,
	target?: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
	const matrix = encodeMatrix(value, {
		errorCorrection: options.errorCorrection,
		margin: options.margin,
	})
	const { size: modules, data, types } = matrix
	const canvas = target ?? document.createElement('canvas')
	canvas.width = options.size
	canvas.height = options.size
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Canvas 2D недоступен')
	}

	ctx.clearRect(0, 0, options.size, options.size)
	const bg = options.transparentBackground ? 'rgba(0,0,0,0)' : options.bgColor
	const eyeBg = options.transparentBackground ? '#ffffff' : options.bgColor

	if (!options.transparentBackground) {
		ctx.fillStyle = bg
		ctx.fillRect(0, 0, options.size, options.size)
	}

	const moduleSize = options.size / modules
	const margin = options.margin
	const core = modules - margin * 2
	const eyes = [
		{ r: margin, c: margin },
		{ r: margin, c: margin + core - 7 },
		{ r: margin + core - 7, c: margin },
	]

	ctx.fillStyle = options.fgColor
	for (let row = 0; row < modules; row += 1) {
		for (let col = 0; col < modules; col += 1) {
			if (!data[row][col]) {
				continue
			}
			if (types[row][col] === QrCodeDataType.Border) {
				continue
			}
			if (isInFinderPattern(row, col, modules, margin)) {
				continue
			}
			drawModule(
				ctx,
				col * moduleSize,
				row * moduleSize,
				moduleSize,
				options.dotStyle,
			)
		}
	}

	for (const eye of eyes) {
		drawEye(
			ctx,
			eye.c * moduleSize,
			eye.r * moduleSize,
			moduleSize,
			options.eyeStyle,
			options.fgColor,
			eyeBg,
		)
	}

	if (options.logoDataUrl) {
		const ratio = Math.min(options.logoSizeRatio ?? 0.2, 0.28)
		const logoSize = options.size * ratio
		const x = (options.size - logoSize) / 2
		const y = (options.size - logoSize) / 2
		const pad = logoSize * 0.08
		ctx.fillStyle = eyeBg
		roundRect(
			ctx,
			x - pad,
			y - pad,
			logoSize + pad * 2,
			logoSize + pad * 2,
			pad,
		)
		ctx.fill()
		const img = await loadImage(options.logoDataUrl)
		ctx.drawImage(img, x, y, logoSize, logoSize)
	}

	return canvas
}

/**
 * Simple monochrome bitmap for roundtrip tests.
 * Returns an ImageData-compatible object (works in browsers and jsdom/Node).
 * Uses only square modules — no styling.
 */
export function matrixToImageData (
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
