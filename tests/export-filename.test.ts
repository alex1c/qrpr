import { describe, expect, it } from 'vitest'
import { buildExportFilename, formatExportDate } from '@/lib/export/filename'

describe('export filenames', () => {
	it('formats date as YYYY-MM-DD', () => {
		expect(formatExportDate(new Date('2026-10-24T12:00:00Z'))).toBe('2026-10-24')
	})

	it('builds readable names', () => {
		const name = buildExportFilename('url', 'png', new Date('2026-10-24T12:00:00Z'))
		expect(name).toBe('qr-pr-url-2026-10-24.png')
		expect(buildExportFilename('wifi', 'svg', new Date('2026-10-24T12:00:00Z'))).toBe(
			'qr-pr-wifi-2026-10-24.svg',
		)
	})
})
