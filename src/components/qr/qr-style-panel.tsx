'use client'

/**
 * Appearance controls: colors, ECC, module styles, logo, presets.
 */
import { useState } from 'react'
import { Field, Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DEFAULT_STYLE, MAX_LOGO_RATIO, STYLE_PRESETS } from '@/lib/qr/presets'
import { getStyleWarnings } from '@/lib/qr/contrast'
import type { QrStyleOptions, StylePresetId } from '@/types/qr'

export function QrStylePanel({
	style,
	onChange,
}: {
	style: QrStyleOptions
	onChange: (next: QrStyleOptions) => void
}) {
	const warnings = getStyleWarnings(style)
	const [logoError, setLogoError] = useState<string | null>(null)

	function patch(partial: Partial<QrStyleOptions>) {
		onChange({ ...style, ...partial })
	}

	function applyPreset(id: StylePresetId) {
		const preset = STYLE_PRESETS[id]
		onChange({
			...style,
			...preset.style,
			logoDataUrl: id === 'classic' ? style.logoDataUrl : style.logoDataUrl,
		})
	}

	async function handleLogo(file: File | null) {
		setLogoError(null)
		if (!file) {
			patch({ logoDataUrl: null })
			return
		}
		if (
			!['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'].includes(
				file.type,
			) ||
			file.size > 2 * 1024 * 1024
		) {
			setLogoError('Выберите PNG, SVG, JPEG или WebP до 2 МБ')
			return
		}
		const url = URL.createObjectURL(file)
		try {
			const image = await new Promise<HTMLImageElement>((resolve, reject) => {
				const img = new Image()
				img.onload = () => resolve(img)
				img.onerror = reject
				img.src = url
			})
			if (
				!image.naturalWidth ||
				!image.naturalHeight ||
				image.naturalWidth * image.naturalHeight > 16_000_000
			)
				throw new Error('Размер изображения')
			const canvas = document.createElement('canvas')
			const scale = Math.min(
				1,
				1024 / Math.max(image.naturalWidth, image.naturalHeight),
			)
			canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
			canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
			const ctx = canvas.getContext('2d')
			if (!ctx) throw new Error('Canvas')
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
			patch({
				logoDataUrl: canvas.toDataURL('image/png'),
				errorCorrection: 'H',
				logoSizeRatio: Math.min(style.logoSizeRatio, MAX_LOGO_RATIO),
			})
		} catch {
			setLogoError('Не удалось прочитать логотип')
		} finally {
			URL.revokeObjectURL(url)
		}
	}

	return (
		<div className="space-y-4">
			{logoError ? <p role="alert">{logoError}</p> : null}
			<div>
				<p className="mb-2 text-sm font-semibold text-[var(--ink)]">Пресеты</p>
				<div className="flex flex-wrap gap-2">
					{(Object.keys(STYLE_PRESETS) as StylePresetId[]).map((id) => (
						<Button
							key={id}
							type="button"
							size="sm"
							variant="secondary"
							onClick={() => applyPreset(id)}
						>
							{STYLE_PRESETS[id].label}
						</Button>
					))}
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={() => onChange({ ...DEFAULT_STYLE })}
					>
						Сбросить
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Цвет модулей" htmlFor="fg">
					<Input
						id="fg"
						type="color"
						value={style.fgColor}
						onChange={(e) => patch({ fgColor: e.target.value })}
						className="h-11 cursor-pointer p-1"
					/>
				</Field>
				<Field label="Цвет фона" htmlFor="bg">
					<Input
						id="bg"
						type="color"
						value={style.bgColor}
						onChange={(e) => patch({ bgColor: e.target.value })}
						className="h-11 cursor-pointer p-1"
						disabled={style.transparentBackground}
					/>
				</Field>
				<Field label="Уровень коррекции" htmlFor="ecc">
					<Select
						id="ecc"
						value={style.errorCorrection}
						onChange={(e) =>
							patch({
								errorCorrection: e.target
									.value as QrStyleOptions['errorCorrection'],
							})
						}
					>
						<option value="L">L (~7%)</option>
						<option value="M">M (~15%)</option>
						<option value="Q">Q (~25%)</option>
						<option value="H">H (~30%)</option>
					</Select>
				</Field>
				<Field label="Отступ (quiet zone)" htmlFor="margin">
					<Select
						id="margin"
						value={String(style.margin)}
						onChange={(e) => patch({ margin: Number(e.target.value) })}
					>
						<option value="1">1 модуль</option>
						<option value="2">2 модуля</option>
						<option value="3">3 модуля</option>
						<option value="4">4 модуля</option>
					</Select>
				</Field>
				<Field label="Стиль модулей" htmlFor="dots">
					<Select
						id="dots"
						value={style.dotStyle}
						onChange={(e) =>
							patch({ dotStyle: e.target.value as QrStyleOptions['dotStyle'] })
						}
					>
						<option value="square">Квадраты</option>
						<option value="rounded">Скруглённые</option>
						<option value="dots">Точки</option>
					</Select>
				</Field>
				<Field label="Маркеры позиции" htmlFor="eyes">
					<Select
						id="eyes"
						value={style.eyeStyle}
						onChange={(e) =>
							patch({ eyeStyle: e.target.value as QrStyleOptions['eyeStyle'] })
						}
					>
						<option value="square">Квадратные</option>
						<option value="rounded">Скруглённые</option>
						<option value="leaf">Мягкие</option>
					</Select>
				</Field>
			</div>

			<label className="flex items-center gap-2 text-sm text-[var(--ink)]">
				<input
					type="checkbox"
					checked={style.transparentBackground}
					onChange={(e) => patch({ transparentBackground: e.target.checked })}
					className="h-4 w-4 rounded border-[var(--border)]"
				/>
				Прозрачный фон (PNG/SVG)
			</label>

			<div className="space-y-2">
				<Field
					label="Логотип в центре"
					htmlFor="logo"
					hint="Рекомендуется до 20% ширины. Для логотипа включается коррекция Q/H."
				>
					<Input
						id="logo"
						type="file"
						accept="image/png,image/jpeg,image/svg+xml,image/webp"
						onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
					/>
				</Field>
				{style.logoDataUrl ? (
					<div className="flex flex-wrap items-center gap-3">
						<Field label="Размер логотипа" htmlFor="logo-size">
							<input
								id="logo-size"
								type="range"
								min={0.1}
								max={MAX_LOGO_RATIO}
								step={0.01}
								value={style.logoSizeRatio}
								onChange={(e) =>
									patch({ logoSizeRatio: Number(e.target.value) })
								}
								className="w-full"
							/>
						</Field>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							onClick={() => patch({ logoDataUrl: null })}
						>
							Убрать логотип
						</Button>
					</div>
				) : null}
			</div>

			{warnings.length > 0 ? (
				<ul className="space-y-1.5" aria-live="polite">
					{warnings.map((w) => (
						<li
							key={w.message}
							className={
								w.level === 'danger'
									? 'text-sm text-red-600 dark:text-red-400'
									: w.level === 'warning'
										? 'text-sm text-amber-700 dark:text-amber-400'
										: 'text-sm text-[var(--ink-muted)]'
							}
						>
							{w.message}
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}
