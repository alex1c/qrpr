/**
 * Safe visual presets for QR styling.
 */
import type { QrStyleOptions, StylePresetId } from '@/types/qr'

export const DEFAULT_STYLE: QrStyleOptions = {
	fgColor: '#0F172A',
	bgColor: '#FFFFFF',
	transparentBackground: false,
	size: 320,
	margin: 2,
	errorCorrection: 'M',
	dotStyle: 'square',
	eyeStyle: 'square',
	logoDataUrl: null,
	logoSizeRatio: 0.2,
}

export const STYLE_PRESETS: Record<
	StylePresetId,
	{ label: string; style: Partial<QrStyleOptions> }
> = {
	classic: {
		label: 'Классический',
		style: {
			fgColor: '#0F172A',
			bgColor: '#FFFFFF',
			dotStyle: 'square',
			eyeStyle: 'square',
			errorCorrection: 'M',
			transparentBackground: false,
		},
	},
	business: {
		label: 'Деловой',
		style: {
			fgColor: '#0D7377',
			bgColor: '#F8FAFC',
			dotStyle: 'square',
			eyeStyle: 'rounded',
			errorCorrection: 'M',
			transparentBackground: false,
		},
	},
	minimal: {
		label: 'Минималистичный',
		style: {
			fgColor: '#334155',
			bgColor: '#FFFFFF',
			dotStyle: 'rounded',
			eyeStyle: 'rounded',
			errorCorrection: 'M',
			transparentBackground: false,
		},
	},
	colorful: {
		label: 'Цветной',
		style: {
			fgColor: '#0F766E',
			bgColor: '#ECFDF5',
			dotStyle: 'dots',
			eyeStyle: 'rounded',
			errorCorrection: 'Q',
			transparentBackground: false,
		},
	},
	contrast: {
		label: 'Контрастный',
		style: {
			fgColor: '#000000',
			bgColor: '#FFFFFF',
			dotStyle: 'square',
			eyeStyle: 'square',
			errorCorrection: 'H',
			transparentBackground: false,
		},
	},
}

export const PNG_EXPORT_SIZES = [256, 512, 1024, 2048] as const

/** Maximum logo ratio to keep finder patterns readable. */
export const MAX_LOGO_RATIO = 0.28
export const RECOMMENDED_LOGO_RATIO = 0.2
