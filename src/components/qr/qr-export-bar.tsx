'use client'

/**
 * Export actions: PNG sizes, SVG, PDF, clipboard copy.
 */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'
import { PNG_EXPORT_SIZES } from '@/lib/qr/presets'
import { exportPng } from '@/lib/export/png'
import { exportSvg } from '@/lib/export/svg'
import { exportPdf } from '@/lib/export/pdf'
import { canCopyImage, copyPngToClipboard, copyTextToClipboard } from '@/lib/export/clipboard'
import type { QrStyleOptions } from '@/types/qr'

export function QrExportBar ({
	value,
	style,
	toolId,
	disabled,
}: {
	value: string
	style: QrStyleOptions
	toolId: string
	disabled?: boolean
}) {
	const [pngSize, setPngSize] = useState<number>(512)
	const [status, setStatus] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)
	const inactive = disabled || !value || busy

	const renderOptions = {
		fgColor: style.fgColor,
		bgColor: style.bgColor,
		transparentBackground: style.transparentBackground,
		size: pngSize,
		margin: style.margin,
		errorCorrection: style.errorCorrection,
		dotStyle: style.dotStyle,
		eyeStyle: style.eyeStyle,
		logoDataUrl: style.logoDataUrl,
		logoSizeRatio: style.logoSizeRatio,
	}

	async function handlePng () {
		setBusy(true)
		setStatus(null)
		try {
			await exportPng(value, { ...renderOptions, size: pngSize }, toolId)
			setStatus('PNG скачан')
		} catch (err) {
			setStatus(err instanceof Error ? err.message : 'Ошибка PNG')
		} finally {
			setBusy(false)
		}
	}

	function handleSvg () {
		setBusy(true)
		setStatus(null)
		try {
			exportSvg(value, { ...renderOptions, size: style.size }, toolId)
			setStatus('SVG скачан')
		} catch (err) {
			setStatus(err instanceof Error ? err.message : 'Ошибка SVG')
		} finally {
			setBusy(false)
		}
	}

	async function handlePdf () {
		setBusy(true)
		setStatus(null)
		try {
			await exportPdf(value, renderOptions, toolId)
			setStatus('PDF скачан')
		} catch (err) {
			setStatus(err instanceof Error ? err.message : 'Ошибка PDF')
		} finally {
			setBusy(false)
		}
	}

	async function handleCopyImage () {
		setBusy(true)
		setStatus(null)
		try {
			await copyPngToClipboard(value, { ...renderOptions, size: pngSize })
			setStatus('PNG скопирован в буфер')
		} catch (err) {
			setStatus(err instanceof Error ? err.message : 'Не удалось скопировать')
		} finally {
			setBusy(false)
		}
	}

	async function handleCopyPayload () {
		setBusy(true)
		setStatus(null)
		try {
			await copyTextToClipboard(value)
			setStatus('Содержимое скопировано')
		} catch (err) {
			setStatus(err instanceof Error ? err.message : 'Не удалось скопировать')
		} finally {
			setBusy(false)
		}
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-end gap-3">
				<div className="min-w-[140px] flex-1">
					<label htmlFor="png-size" className="mb-1.5 block text-xs font-medium text-[var(--ink-muted)]">
						Размер PNG
					</label>
					<Select
						id="png-size"
						value={String(pngSize)}
						onChange={(e) => setPngSize(Number(e.target.value))}
						disabled={inactive}
					>
						{PNG_EXPORT_SIZES.map((size) => (
							<option key={size} value={size}>
								{size}×{size}
							</option>
						))}
					</Select>
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button onClick={handlePng} disabled={inactive}>
					Скачать PNG
				</Button>
				<Button variant="secondary" onClick={handleSvg} disabled={inactive}>
					SVG
				</Button>
				<Button variant="secondary" onClick={handlePdf} disabled={inactive}>
					PDF
				</Button>
				{canCopyImage() ? (
					<Button variant="ghost" onClick={handleCopyImage} disabled={inactive}>
						Копировать PNG
					</Button>
				) : null}
				<Button variant="ghost" onClick={handleCopyPayload} disabled={inactive}>
					Копировать данные
				</Button>
			</div>
			<p className="min-h-[1.25rem] text-sm text-[var(--ink-muted)]" aria-live="polite">
				{busy ? 'Подготовка файла…' : status}
			</p>
		</div>
	)
}
