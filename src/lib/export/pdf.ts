/**
 * PDF export embedding a high-resolution PNG of the QR (no distortion).
 */
import { jsPDF } from 'jspdf'
import { renderQrToCanvas, type CanvasRenderOptions } from '@/lib/qr/render-canvas'
import { downloadBlob } from '@/lib/export/download'
import { buildExportFilename } from '@/lib/export/filename'

export async function exportPdf (
	value: string,
	options: CanvasRenderOptions,
	toolId: string,
): Promise<void> {
	// Render at high res for sharp embedding
	const canvas = await renderQrToCanvas(value, {
		...options,
		size: Math.max(options.size, 1024),
	})
	const dataUrl = canvas.toDataURL('image/png')

	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	})
	const pageWidth = doc.internal.pageSize.getWidth()
	const qrMm = 80
	const x = (pageWidth - qrMm) / 2
	const y = 40
	doc.addImage(dataUrl, 'PNG', x, y, qrMm, qrMm)
	doc.setFontSize(10)
	doc.setTextColor(100)
	doc.text('QR-PR · qr-pr.ru', pageWidth / 2, y + qrMm + 12, { align: 'center' })

	const blob = doc.output('blob')
	downloadBlob(blob, buildExportFilename(toolId, 'pdf'))
}
