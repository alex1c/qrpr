/**
 * Vector PDF export using the same SVG as preview.
 */
import { jsPDF } from 'jspdf'
import { type CanvasRenderOptions } from '@/lib/qr/render-canvas'
import { renderQrSvg } from '@/lib/qr/render-svg'
import 'svg2pdf.js'
import { downloadBlob } from '@/lib/export/download'
import { buildExportFilename } from '@/lib/export/filename'

export async function exportPdf(
	value: string,
	options: CanvasRenderOptions,
	toolId: string,
): Promise<void> {
	const svg = new DOMParser().parseFromString(
		renderQrSvg(value, options),
		'image/svg+xml',
	).documentElement

	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	})
	const pageWidth = doc.internal.pageSize.getWidth()
	const qrMm = 80
	const x = (pageWidth - qrMm) / 2
	const y = 40
	await doc.svg(svg as unknown as SVGElement, {
		x,
		y,
		width: qrMm,
		height: qrMm,
	})
	doc.setFontSize(10)
	doc.setTextColor(100)
	doc.text('QR-PR · qr-pr.ru', pageWidth / 2, y + qrMm + 12, {
		align: 'center',
	})

	const blob = doc.output('blob')
	downloadBlob(blob, buildExportFilename(toolId, 'pdf'))
}
