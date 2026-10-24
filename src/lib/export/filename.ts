/**
 * Human-readable download filenames for QR exports.
 */

function pad (n: number): string {
	return String(n).padStart(2, '0')
}

export function formatExportDate (date: Date = new Date()): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function buildExportFilename (
	toolId: string,
	extension: 'png' | 'svg' | 'pdf',
	date: Date = new Date(),
): string {
	const safeTool = toolId.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'qr'
	return `qr-pr-${safeTool}-${formatExportDate(date)}.${extension}`
}
