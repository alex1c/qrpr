import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	PROJECT_BRAND,
	PROJECT_DEVELOPER_LABEL,
	PROJECT_URL,
	SOCIAL,
} from '@/config/site'
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
					визиток, мессенджеров и других повседневных задач. Фокус — скорость,
					понятный интерфейс, качественный экспорт и бережное отношение к данным
					в полях инструментов.
				</p>
				<p>
					Статическая генерация выполняется в браузере. Мы не требуем регистрацию
					и не ставим водяные знаки на обычные статические коды.
				</p>
				<p>
					{PROJECT_DEVELOPER_LABEL}:{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_URL}
					</a>
					. {PROJECT_BRAND} — проект и сайт разработчика, не юридическое лицо на
					этой странице.
				</p>
				<p>
					В планах — пакетная генерация, этикетки и динамические QR для бизнеса.
					Актуальный план развития описан в документации репозитория.
				</p>
				<p>
					Исходный код:{' '}
					<a
						href={SOCIAL.github}
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
