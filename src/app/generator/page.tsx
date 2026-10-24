import { QrGeneratorLazy } from '@/components/qr/qr-generator-lazy'
import { Breadcrumbs, FaqSection, Prose } from '@/components/seo/page-shell'
import { COMMON_FAQ } from '@/lib/seo/faq-content'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Онлайн-генератор QR-кодов',
	description:
		'Универсальный генератор статических QR-кодов: URL, Wi‑Fi, vCard, Telegram, WhatsApp и другие типы. Оформление и экспорт PNG, SVG, PDF.',
	path: '/generator',
})

export default function GeneratorPage () {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Генератор', path: '/generator' }]} />
			<h1 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
				Онлайн-генератор QR-кодов
			</h1>
			<Prose>
				<p>
					Выберите тип данных, заполните поля и скачайте результат. Генерация
					выполняется в браузере — без регистрации и водяных знаков.
				</p>
			</Prose>
			<div className="my-10">
				<QrGeneratorLazy initialType="url" />
			</div>
			<FaqSection items={[...COMMON_FAQ]} />
		</div>
	)
}
