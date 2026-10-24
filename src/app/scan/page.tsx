import { QrScannerLazy } from '@/components/scanner/qr-scanner-lazy'
import { Breadcrumbs, FaqSection, Prose } from '@/components/seo/page-shell'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Сканер QR-кодов онлайн',
	description:
		'Считайте QR из PNG, JPEG, WebP или с камеры прямо в браузере. Данные не загружаются на сервер.',
	path: '/scan',
})

const FAQ = [
	{
		question: 'Отправляется ли изображение на сервер?',
		answer:
			'Нет. Распознавание выполняется локально в браузере. Файлы не загружаются на сервер QR-PR.',
	},
	{
		question: 'Почему не работает камера?',
		answer:
			'Браузеры требуют HTTPS (или localhost) и явное разрешение. Если доступа нет — загрузите снимок файла.',
	},
	{
		question: 'Откроется ли ссылка сама?',
		answer:
			'Нет. Сначала показывается содержимое. Открытие — только по вашему клику и только для безопасных схем.',
	},
]

export default function ScanPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Сканер', path: '/scan' }]} />
			<h1 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
				Сканер QR-кодов онлайн
			</h1>
			<Prose>
				<p>
					Загрузите изображение, вставьте его из буфера обмена или используйте
					камеру. Результат можно скопировать или открыть вручную.
				</p>
			</Prose>
			<div className="my-10">
				<QrScannerLazy mode="scan" />
			</div>
			<FaqSection items={FAQ} />
		</div>
	)
}
