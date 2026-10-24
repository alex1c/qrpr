'use client'

/**
 * Live SVG preview of the styled QR code.
 */
import { useMemo } from 'react'
import { renderQrSvg } from '@/lib/qr/render-svg'
import type { QrStyleOptions } from '@/types/qr'
import { cn } from '@/lib/utils/cn'

export function QrPreview ({
	value,
	style,
	className,
}: {
	value: string
	style: QrStyleOptions
	className?: string
}) {
	const { svg, error } = useMemo(() => {
		if (!value) {
			return { svg: '', error: null as string | null }
		}
		try {
			return {
				svg: renderQrSvg(value, {
					fgColor: style.fgColor,
					bgColor: style.bgColor,
					transparentBackground: style.transparentBackground,
					size: style.size,
					margin: style.margin,
					errorCorrection: style.errorCorrection,
					dotStyle: style.dotStyle,
					eyeStyle: style.eyeStyle,
					logoDataUrl: style.logoDataUrl,
					logoSizeRatio: style.logoSizeRatio,
				}),
				error: null as string | null,
			}
		} catch (err) {
			return {
				svg: '',
				error: err instanceof Error ? err.message : 'Ошибка генерации',
			}
		}
	}, [value, style])

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6',
				className,
			)}
		>
			{!value ? (
				<p className="text-sm text-[var(--ink-muted)]">
					Заполните поля — QR появится здесь
				</p>
			) : error ? (
				<p className="text-sm text-red-600" role="alert">
					{error}
				</p>
			) : (
				<div
					className="qr-preview max-w-full [&_svg]:h-auto [&_svg]:max-w-full"
					style={{ width: Math.min(style.size, 320) }}
					dangerouslySetInnerHTML={{ __html: svg }}
					aria-live="polite"
				/>
			)}
		</div>
	)
}
