/**
 * Vector SVG renderer for styled QR codes (true vector, not raster-in-SVG).
 */
import { encodeMatrix, QrCodeDataType } from '@/lib/qr/encode-matrix'
import type { DotStyle, ErrorCorrectionLevel, EyeStyle } from '@/types/qr'

export interface SvgRenderOptions {
	fgColor: string
	bgColor: string
	transparentBackground: boolean
	/** Output pixel size of the SVG viewport. */
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

function modulePath (
	x: number,
	y: number,
	module: number,
	style: DotStyle,
): string {
	const pad = style === 'dots' ? module * 0.2 : style === 'rounded' ? module * 0.05 : 0
	const w = module - pad * 2
	const rx = style === 'square' ? 0 : style === 'rounded' ? module * 0.25 : w / 2
	const cx = x + pad
	const cy = y + pad
	if (style === 'dots') {
		const r = w / 2
		return `<circle cx="${cx + r}" cy="${cy + r}" r="${r}" />`
	}
	if (rx === 0) {
		return `<rect x="${cx}" y="${cy}" width="${w}" height="${w}" />`
	}
	return `<rect x="${cx}" y="${cy}" width="${w}" height="${w}" rx="${rx}" ry="${rx}" />`
}

function eyeElement (
	originX: number,
	originY: number,
	module: number,
	style: EyeStyle,
	fg: string,
): string {
	const outer = 7 * module
	const mid = 5 * module
	const inner = 3 * module
	const outerR = style === 'square' ? 0 : style === 'rounded' ? module : module * 1.5
	const midR = style === 'square' ? 0 : style === 'rounded' ? module * 0.7 : module
	const innerR = style === 'square' ? 0 : style === 'rounded' ? module * 0.4 : module * 0.5

	const ox = originX
	const oy = originY
	const mx = originX + module
	const my = originY + module
	const ix = originX + 2 * module
	const iy = originY + 2 * module

	return [
		`<rect x="${ox}" y="${oy}" width="${outer}" height="${outer}" rx="${outerR}" ry="${outerR}" fill="${fg}" />`,
		`<rect x="${mx}" y="${my}" width="${mid}" height="${mid}" rx="${midR}" ry="${midR}" fill="var(--qr-bg, #fff)" />`,
		`<rect x="${ix}" y="${iy}" width="${inner}" height="${inner}" rx="${innerR}" ry="${innerR}" fill="${fg}" />`,
	].join('')
}

/**
 * Render QR payload as an SVG string.
 */
export function renderQrSvg (value: string, options: SvgRenderOptions): string {
	const matrix = encodeMatrix(value, {
		errorCorrection: options.errorCorrection,
		margin: options.margin,
	})
	const { size: modules, data, types } = matrix
	const pixelSize = options.size
	const moduleSize = pixelSize / modules
	const bg = options.transparentBackground ? 'none' : options.bgColor
	const fg = options.fgColor

	const parts: string[] = []
	parts.push(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${pixelSize} ${pixelSize}" role="img" aria-label="QR code">`,
	)
	parts.push(`<style>:root{--qr-bg:${options.transparentBackground ? '#ffffff' : options.bgColor}}</style>`)
	if (bg !== 'none') {
		parts.push(`<rect width="100%" height="100%" fill="${bg}" />`)
	} else {
		// Keep white under eyes when transparent so cutouts remain visible on dark surfaces optionally —
		// eyes use CSS var; for true transparency we still draw a white plate only under finder if needed.
		parts.push(`<!-- transparent background -->`)
	}

	const margin = options.margin
	const core = modules - margin * 2
	const eyes = [
		{ r: margin, c: margin },
		{ r: margin, c: margin + core - 7 },
		{ r: margin + core - 7, c: margin },
	]

	// Draw data modules excluding finder patterns (rendered separately for eye styles)
	parts.push(`<g fill="${fg}">`)
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
			parts.push(
				modulePath(
					col * moduleSize,
					row * moduleSize,
					moduleSize,
					options.dotStyle,
				),
			)
		}
	}
	parts.push('</g>')

	for (const eye of eyes) {
		parts.push(
			eyeElement(
				eye.c * moduleSize,
				eye.r * moduleSize,
				moduleSize,
				options.eyeStyle,
				fg,
			),
		)
	}

	if (options.logoDataUrl) {
		const ratio = Math.min(options.logoSizeRatio ?? 0.2, 0.28)
		const logoSize = pixelSize * ratio
		const x = (pixelSize - logoSize) / 2
		const y = (pixelSize - logoSize) / 2
		const pad = logoSize * 0.08
		parts.push(
			`<rect x="${x - pad}" y="${y - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="${pad}" fill="${options.transparentBackground ? '#ffffff' : options.bgColor}" />`,
		)
		parts.push(
			`<image href="${escapeXmlAttr(options.logoDataUrl)}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`,
		)
	}

	parts.push('</svg>')
	return parts.join('')
}

function escapeXmlAttr (value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
}
