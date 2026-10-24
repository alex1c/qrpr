/**
 * Client-side QR decode from ImageData / HTMLImageElement / File.
 * Uses jsQR — nothing is uploaded to a server.
 */
import jsQR from 'jsqr'
import type { DecodeResult } from '@/types/qr'
import { detectContentType } from '@/lib/scanner/detect-type'

export interface DecodeOptions {
	/** Attempt inversion for light-on-dark codes. */
	inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst'
}

export function decodeImageData (
	imageData: ImageData,
	options: DecodeOptions = {},
): DecodeResult | null {
	const code = jsQR(imageData.data, imageData.width, imageData.height, {
		inversionAttempts: options.inversionAttempts ?? 'attemptBoth',
	})
	if (!code?.data) {
		return null
	}
	return {
		raw: code.data,
		type: detectContentType(code.data),
	}
}

/**
 * Draw image onto canvas and decode.
 */
export async function decodeHtmlImage (
	image: HTMLImageElement | ImageBitmap,
	options?: DecodeOptions,
): Promise<DecodeResult | null> {
	const width = 'naturalWidth' in image ? image.naturalWidth || image.width : image.width
	const height = 'naturalHeight' in image ? image.naturalHeight || image.height : image.height
	if (!width || !height) {
		return null
	}

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d', { willReadFrequently: true })
	if (!ctx) {
		return null
	}
	ctx.drawImage(image, 0, 0)
	const imageData = ctx.getImageData(0, 0, width, height)
	return decodeImageData(imageData, options)
}

export async function decodeFile (
	file: File,
	options?: DecodeOptions,
): Promise<DecodeResult | null> {
	const bitmap = await createImageBitmap(file)
	try {
		return await decodeHtmlImage(bitmap, options)
	} finally {
		bitmap.close()
	}
}

export async function decodeDataUrl (
	dataUrl: string,
	options?: DecodeOptions,
): Promise<DecodeResult | null> {
	const image = await loadImage(dataUrl)
	return decodeHtmlImage(image, options)
}

function loadImage (src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
		img.src = src
	})
}
