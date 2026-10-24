'use client'

/**
 * Image / camera QR scanner — all processing stays in the browser.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MAX_IMAGE_UPLOAD_BYTES } from '@/config/site'
import { decodeFile, decodeImageData } from '@/lib/scanner/decode'
import {
	analyzeUrl,
	canOfferOpen,
	contentTypeLabel,
} from '@/lib/scanner/detect-type'
import { copyTextToClipboard } from '@/lib/export/clipboard'
import type { DecodeResult } from '@/types/qr'
import { cn } from '@/lib/utils/cn'

const ACCEPT = 'image/png,image/jpeg,image/webp'

export function QrScanner ({ mode = 'scan' }: { mode?: 'scan' | 'check' }) {
	const [result, setResult] = useState<DecodeResult | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [cameraOn, setCameraOn] = useState(false)
	const [dragOver, setDragOver] = useState(false)
	const videoRef = useRef<HTMLVideoElement>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const rafRef = useRef<number | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const stopCamera = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		streamRef.current?.getTracks().forEach((t) => t.stop())
		streamRef.current = null
		setCameraOn(false)
	}, [])

	useEffect(() => () => stopCamera(), [stopCamera])

	async function processFile (file: File) {
		setError(null)
		setResult(null)
		setStatus(null)
		if (!ACCEPT.split(',').includes(file.type) && !file.type.startsWith('image/')) {
			setError('Поддерживаются PNG, JPEG и WebP')
			return
		}
		if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
			setError('Файл слишком большой (макс. 8 МБ)')
			return
		}
		try {
			const decoded = await decodeFile(file)
			if (!decoded) {
				setError('QR-код не найден на изображении')
				return
			}
			setResult(decoded)
			setStatus('QR распознан')
			stopCamera()
		} catch {
			setError('Не удалось прочитать изображение')
		}
	}

	async function handlePaste (e: React.ClipboardEvent) {
		const items = e.clipboardData?.items
		if (!items) {
			return
		}
		for (const item of Array.from(items)) {
			if (item.type.startsWith('image/')) {
				const file = item.getAsFile()
				if (file) {
					e.preventDefault()
					await processFile(file)
					return
				}
			}
		}
	}

	async function startCamera () {
		setError(null)
		setResult(null)
		if (!window.isSecureContext) {
			setError(
				'Камера доступна только по HTTPS или на localhost. Используйте загрузку файла.',
			)
			return
		}
		if (!navigator.mediaDevices?.getUserMedia) {
			setError('Камера не поддерживается в этом браузере')
			return
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: 'environment' } },
				audio: false,
			})
			streamRef.current = stream
			setCameraOn(true)
			const video = videoRef.current
			if (video) {
				video.srcObject = stream
				await video.play()
				scanLoop()
			}
		} catch {
			setError(
				'Нет доступа к камере. Разрешите доступ в браузере или загрузите изображение.',
			)
			stopCamera()
		}
	}

	function scanLoop () {
		const video = videoRef.current
		if (!video || video.readyState < 2) {
			rafRef.current = requestAnimationFrame(scanLoop)
			return
		}
		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		const ctx = canvas.getContext('2d', { willReadFrequently: true })
		if (!ctx) {
			return
		}
		ctx.drawImage(video, 0, 0)
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const decoded = decodeImageData(imageData)
		if (decoded) {
			setResult(decoded)
			setStatus('QR распознан с камеры')
			setError(null)
			stopCamera()
			return
		}
		rafRef.current = requestAnimationFrame(scanLoop)
	}

	const analysis = result ? analyzeUrl(result.raw) : null

	return (
		<div className="space-y-6" onPaste={handlePaste}>
			<div
				className={cn(
					'rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
					dragOver
						? 'border-[var(--accent)] bg-[var(--accent-soft)]'
						: 'border-[var(--border)] bg-[var(--surface)]',
				)}
				onDragOver={(e) => {
					e.preventDefault()
					setDragOver(true)
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={(e) => {
					e.preventDefault()
					setDragOver(false)
					const file = e.dataTransfer.files?.[0]
					if (file) {
						void processFile(file)
					}
				}}
			>
				<p className="mb-4 text-[var(--ink)]">
					Перетащите изображение QR сюда, вставьте из буфера (Ctrl+V) или выберите файл
				</p>
				<input
					ref={inputRef}
					type="file"
					accept={ACCEPT}
					className="sr-only"
					onChange={(e) => {
						const file = e.target.files?.[0]
						if (file) {
							void processFile(file)
						}
					}}
				/>
				<div className="flex flex-wrap justify-center gap-2">
					<Button type="button" onClick={() => inputRef.current?.click()}>
						Выбрать файл
					</Button>
					{!cameraOn ? (
						<Button type="button" variant="secondary" onClick={startCamera}>
							Сканировать камерой
						</Button>
					) : (
						<Button type="button" variant="danger" onClick={stopCamera}>
							Остановить камеру
						</Button>
					)}
				</div>
				<p className="mt-3 text-xs text-[var(--ink-faint)]">
					PNG, JPEG, WebP · до 8 МБ · обработка только в браузере
				</p>
			</div>

			{cameraOn ? (
				<div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
					<video
						ref={videoRef}
						className="mx-auto max-h-[420px] w-full object-contain"
						playsInline
						muted
						aria-label="Поток с камеры"
					/>
				</div>
			) : (
				<video ref={videoRef} className="hidden" playsInline muted />
			)}

			<div aria-live="polite" className="min-h-[1.25rem] text-sm text-[var(--ink-muted)]">
				{status}
			</div>
			{error ? (
				<p className="text-sm text-red-600 dark:text-red-400" role="alert">
					{error}
				</p>
			) : null}

			{result ? (
				<div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
					<h2 className="text-lg font-semibold text-[var(--ink)]">
						{mode === 'check' ? 'Результат проверки' : 'Результат'}
					</h2>
					<dl className="grid gap-3 text-sm">
						<div>
							<dt className="text-[var(--ink-muted)]">Тип данных</dt>
							<dd className="font-medium text-[var(--ink)]">
								{contentTypeLabel(result.type)}
							</dd>
						</div>
						<div>
							<dt className="text-[var(--ink-muted)]">Длина</dt>
							<dd className="font-medium text-[var(--ink)]">
								{result.raw.length} символов
							</dd>
						</div>
						<div>
							<dt className="mb-1 text-[var(--ink-muted)]">Содержимое</dt>
							<dd>
								<pre className="max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-[var(--surface-muted)] p-3 text-[var(--ink)]">
									{result.raw}
								</pre>
							</dd>
						</div>
					</dl>

					{mode === 'check' && analysis ? (
						<div className="space-y-2 rounded-xl bg-[var(--surface-muted)] p-4 text-sm">
							<p>
								URL:{' '}
								{analysis.isUrl
									? analysis.isValidUrl
										? 'структура корректна'
										: 'похоже на URL, но разобрать не удалось'
									: 'не похоже на URL'}
							</p>
							{analysis.hostname ? (
								<p>
									Хост: <strong>{analysis.hostname}</strong>
								</p>
							) : null}
							{analysis.warnings.map((w) => (
								<p key={w} className="text-amber-800 dark:text-amber-300">
									{w}
								</p>
							))}
							<p className="text-[var(--ink-muted)]">
								Это не антивирус и не проверка репутации сайта.
							</p>
						</div>
					) : null}

					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							variant="secondary"
							onClick={async () => {
								await copyTextToClipboard(result.raw)
								setStatus('Скопировано')
							}}
						>
							Копировать
						</Button>
						{canOfferOpen(result.raw) ? (
							<a
								href={result.raw}
								target="_blank"
								rel="noopener noreferrer nofollow"
								className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-4 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
							>
								Открыть ссылку
							</a>
						) : null}
					</div>
					<p className="text-xs text-[var(--ink-faint)]">
						Ссылки не открываются автоматически. Перед переходом проверьте адрес.
					</p>
				</div>
			) : null}
		</div>
	)
}
