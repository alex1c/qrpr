import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import { buildPageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = buildPageMetadata({
	title: 'О сервисе',
	description:
		'QR-PR — бесплатные онлайн-инструменты для создания, оформления, считывания и проверки статических QR-кодов.',
	path: '/about',
})

export default function AboutPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'О сервисе', path: '/about' }]} />
			<h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
				О сервисе QR-PR
			</h1>
			<Prose>
				<p>
					QR-PR помогает быстро создавать статические QR-коды для ссылок, Wi‑Fi,
					визиток, мессенджеров и других повседневных задач. Фокус MVP — скорость,
					понятный интерфейс, качественный экспорт и приватность.
				</p>
				<p>
					Статическая генерация выполняется в браузере. Мы не требуем регистрацию
					и не ставим водяные знаки на обычные статические коды.
				</p>
				<p>
					В планах — пакетная генерация, этикетки и динамические QR для бизнеса.
					Актуальный план развития описан в документации репозитория.
				</p>
				<p>
					Исходный код:{' '}
					<a
						href="https://github.com/alex1c/qrpr"
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						github.com/alex1c/qrpr
					</a>
					. Контакты — на странице{' '}
					<Link href="/contact" className="text-[var(--accent)] hover:underline">
						/contact
					</Link>
					.
				</p>
			</Prose>
		</div>
	)
}
