import { describe, expect, it } from 'vitest'
import { contrastRatio, getStyleWarnings } from '@/lib/qr/contrast'

describe('contrast helpers', () => {
	it('rates black on white highly', () => {
		const ratio = contrastRatio('#000000', '#ffffff')
		expect(ratio).toBeGreaterThan(20)
	})

	it('warns on low contrast', () => {
		const warnings = getStyleWarnings({
			fgColor: '#cccccc',
			bgColor: '#dddddd',
			transparentBackground: false,
			logoDataUrl: null,
			logoSizeRatio: 0.2,
			errorCorrection: 'M',
		})
		expect(warnings.some((w) => w.level === 'danger' || w.level === 'warning')).toBe(
			true,
		)
	})

	it('warns when logo needs higher ECC', () => {
		const warnings = getStyleWarnings({
			fgColor: '#000000',
			bgColor: '#ffffff',
			transparentBackground: false,
			logoDataUrl: 'data:image/png;base64,aaa',
			logoSizeRatio: 0.2,
			errorCorrection: 'L',
		})
		expect(warnings.some((w) => w.message.includes('коррекц'))).toBe(true)
	})
})
