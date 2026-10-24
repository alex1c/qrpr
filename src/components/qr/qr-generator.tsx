'use client'

/**
 * Main interactive QR generator: type tabs, form, style, preview, export.
 */
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { QR_TOOLS, getToolById } from '@/config/tools'
import { emptyPayload } from '@/components/qr/defaults'
import { QrTypeForm } from '@/components/qr/forms'
import { QrPreview } from '@/components/qr/qr-preview'
import { QrStylePanel } from '@/components/qr/qr-style-panel'
import { QrExportBar } from '@/components/qr/qr-export-bar'
import { DEFAULT_STYLE } from '@/lib/qr/presets'
import {
	serializeQrPayload,
	validateQrPayload,
} from '@/lib/qr/serializers'
import { cn } from '@/lib/utils/cn'
import type { QrPayloadMap, QrStyleOptions, QrToolId } from '@/types/qr'

export function QrGenerator ({
	initialType = 'url',
	lockType = false,
	showTypeNav = true,
	forceLogoHint = false,
}: {
	initialType?: QrToolId
	/** Hide type switcher on dedicated SEO pages. */
	lockType?: boolean
	showTypeNav?: boolean
	forceLogoHint?: boolean
}) {
	const [type, setType] = useState<QrToolId>(initialType)
	const [payload, setPayload] = useState<QrPayloadMap[QrToolId]>(
		() => emptyPayload(initialType),
	)
	const [style, setStyle] = useState<QrStyleOptions>(() => ({
		...DEFAULT_STYLE,
		...(forceLogoHint ? { errorCorrection: 'Q' as const } : {}),
	}))
	const [showStyle, setShowStyle] = useState(forceLogoHint)

	const validationError = useMemo(
		() => validateQrPayload(type, payload as never),
		[type, payload],
	)

	const encoded = useMemo(() => {
		if (validationError) {
			return ''
		}
		try {
			return serializeQrPayload(type, payload as never)
		} catch {
			return ''
		}
	}, [type, payload, validationError])

	function handleTypeChange (next: QrToolId) {
		setType(next)
		setPayload(emptyPayload(next))
	}

	const tool = getToolById(type)

	return (
		<div className="space-y-6">
			{showTypeNav && !lockType ? (
				<div
					className="flex flex-wrap gap-2"
					role="tablist"
					aria-label="Тип QR-кода"
				>
					{QR_TOOLS.map((item) => (
						<button
							key={item.id}
							type="button"
							role="tab"
							aria-selected={type === item.id}
							className={cn(
								'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors min-h-[44px]',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
								type === item.id
									? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
									: 'border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--accent)]/40',
							)}
							onClick={() => handleTypeChange(item.id)}
						>
							{item.shortTitle}
						</button>
					))}
				</div>
			) : null}

			{lockType ? (
				<p className="text-sm text-[var(--ink-muted)]">
					Тип: <span className="font-medium text-[var(--ink)]">{tool.shortTitle}</span>
					{' · '}
					<Link href="/generator" className="text-[var(--accent)] hover:underline">
						Все типы в генераторе
					</Link>
				</p>
			) : null}

			<div className="grid gap-8 lg:grid-cols-2">
				<section className="space-y-6" aria-label="Данные и настройки">
					<div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
						<h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
							Данные
						</h2>
						<QrTypeForm
							type={type}
							payload={payload as never}
							onChange={(next) => setPayload(next)}
						/>
						{validationError ? (
							<p className="mt-3 text-sm text-[var(--ink-muted)]" aria-live="polite">
								{validationError}
							</p>
						) : encoded ? (
							<p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400" aria-live="polite">
								Готово к скачиванию
							</p>
						) : null}
					</div>

					<div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
						<button
							type="button"
							className="flex w-full items-center justify-between text-left text-lg font-semibold text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
							aria-expanded={showStyle}
							onClick={() => setShowStyle((v) => !v)}
						>
							Оформление
							<span className="text-sm font-normal text-[var(--ink-muted)]">
								{showStyle ? 'Скрыть' : 'Показать'}
							</span>
						</button>
						{showStyle ? (
							<div className="mt-4">
								<QrStylePanel style={style} onChange={setStyle} />
							</div>
						) : null}
					</div>
				</section>

				<section
					className="space-y-4 lg:sticky lg:top-24 lg:self-start"
					aria-label="Предпросмотр и экспорт"
				>
					<QrPreview value={encoded} style={style} />
					<div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
						<h2 className="mb-3 text-lg font-semibold text-[var(--ink)]">
							Скачать
						</h2>
						<QrExportBar
							value={encoded}
							style={style}
							toolId={type}
							disabled={Boolean(validationError) || !encoded}
						/>
					</div>
				</section>
			</div>
		</div>
	)
}
