'use client'

/**
 * Appearance controls: colors, ECC, module styles, logo, presets.
 */
import { Field, Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	DEFAULT_STYLE,
	MAX_LOGO_RATIO,
	STYLE_PRESETS,
} from '@/lib/qr/presets'
import { getStyleWarnings } from '@/lib/qr/contrast'
import type { QrStyleOptions, StylePresetId } from '@/types/qr'

export function QrStylePanel ({
	style,
	onChange,
}: {
	style: QrStyleOptions
	onChange: (next: QrStyleOptions) => void
}) {
	const warnings = getStyleWarnings(style)

	function patch (partial: Partial<QrStyleOptions>) {
		onChange({ ...style, ...partial })
	}

	function applyPreset (id: StylePresetId) {
		const preset = STYLE_PRESETS[id]
		onChange({
			...style,
			...preset.style,
			logoDataUrl: id === 'classic' ? style.logoDataUrl : style.logoDataUrl,
		})
	}

	function handleLogo (file: File | null) {
		if (!file) {
			patch({ logoDataUrl: null })
			return
		}
		if (!file.type.startsWith('image/')) {
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			const dataUrl = String(reader.result)
			const nextEcc =
				style.errorCorrection === 'L' || style.errorCorrection === 'M'
					? 'Q'
					: style.errorCorrection
			patch({
				logoDataUrl: dataUrl,
				errorCorrection: nextEcc,
				logoSizeRatio: Math.min(style.logoSizeRatio, MAX_LOGO_RATIO),
			})
		}
		reader.readAsDataURL(file)
	}

	return (
		<div className="space-y-4">
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
								errorCorrection: e.target.value as QrStyleOptions['errorCorrection'],
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
