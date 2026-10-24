/**
 * SVG export — true vector markup from renderQrSvg.
 */
import { renderQrSvg, type SvgRenderOptions } from '@/lib/qr/render-svg'
import { downloadBlob } from '@/lib/export/download'
import { buildExportFilename } from '@/lib/export/filename'

export function exportSvg (
	value: string,
	options: SvgRenderOptions,
	toolId: string,
): void {
	const svg = renderQrSvg(value, options)
	const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
	downloadBlob(blob, buildExportFilename(toolId, 'svg'))
}

export function getSvgString (value: string, options: SvgRenderOptions): string {
	return renderQrSvg(value, options)
}
