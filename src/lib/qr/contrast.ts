/**
 * Relative luminance / contrast helpers for scannability warnings.
 */

function parseHexColor (hex: string): { r: number; g: number; b: number } | null {
	const cleaned = hex.trim().replace('#', '')
	if (!/^[0-9a-fA-F]{6}$/.test(cleaned) && !/^[0-9a-fA-F]{3}$/.test(cleaned)) {
		return null
	}
	const full =
		cleaned.length === 3
			? cleaned
					.split('')
					.map((c) => c + c)
					.join('')
			: cleaned
	return {
		r: parseInt(full.slice(0, 2), 16),
		g: parseInt(full.slice(2, 4), 16),
		b: parseInt(full.slice(4, 6), 16),
	}
}

function channelToLinear (c: number): number {
	const s = c / 255
	return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance (hex: string): number | null {
	const rgb = parseHexColor(hex)
	if (!rgb) {
		return null
	}
	const r = channelToLinear(rgb.r)
	const g = channelToLinear(rgb.g)
	const b = channelToLinear(rgb.b)
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio (fg: string, bg: string): number | null {
	const l1 = relativeLuminance(fg)
	const l2 = relativeLuminance(bg)
	if (l1 === null || l2 === null) {
		return null
	}
	const lighter = Math.max(l1, l2)
	const darker = Math.min(l1, l2)
	return (lighter + 0.05) / (darker + 0.05)
}

export interface StyleWarning {
	level: 'info' | 'warning' | 'danger'
	message: string
}

export function getStyleWarnings (options: {
	fgColor: string
	bgColor: string
	transparentBackground: boolean
	logoDataUrl: string | null
	logoSizeRatio: number
	errorCorrection: string
}): StyleWarning[] {
	const warnings: StyleWarning[] = []

	if (!options.transparentBackground) {
		const ratio = contrastRatio(options.fgColor, options.bgColor)
		if (ratio !== null && ratio < 3) {
			warnings.push({
				level: 'danger',
				message:
					'Низкий контраст цветов — QR-код может плохо сканироваться. Выберите более контрастную пару или пресет «Контрастный».',
			})
		} else if (ratio !== null && ratio < 4.5) {
			warnings.push({
				level: 'warning',
				message:
					'Контраст ниже рекомендуемого. Проверьте сканирование на нескольких устройствах.',
			})
		}
	} else {
		warnings.push({
			level: 'info',
			message:
				'Прозрачный фон: итоговая читаемость зависит от поверхности, на которую будет наложен QR.',
		})
	}

	if (options.logoDataUrl) {
		if (options.logoSizeRatio > 0.28) {
			warnings.push({
				level: 'danger',
				message:
					'Логотип слишком большой и может перекрыть данные. Уменьшите размер или уберите логотип.',
			})
		} else if (options.errorCorrection !== 'H' && options.errorCorrection !== 'Q') {
			warnings.push({
				level: 'warning',
				message:
					'Для QR с логотипом рекомендуется уровень коррекции ошибок Q или H.',
			})
		}
	}

	return warnings
}
