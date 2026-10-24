import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	PROJECT_BRAND,
	PROJECT_LINK_LABEL,
	PROJECT_URL,
	SITE_NAME,
	SOCIAL,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Контакты',
	description: `Контакты ${SITE_NAME}: проект ${PROJECT_BRAND}, сайт ${PROJECT_URL.replace('https://', '')}.`,
	path: '/contact',
})

export default function ContactPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Контакты', path: '/contact' }]} />
			<h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
				Контакты
			</h1>
			<Prose>
				<p>
					{SITE_NAME} — онлайн-сервис в рамках проекта{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_BRAND}
					</a>
					. На этой странице не публикуются email, ФИО, почтовый адрес и
					юридические реквизиты — они не указаны намеренно, без подстановки
					вымышленных данных.
				</p>
				<p>
					Сайт проекта:{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_URL}
					</a>
				</p>
				<p>
					{PROJECT_LINK_LABEL} не описывается здесь как юридическое лицо: это
					название проекта / бренда. Для связи используйте контакты, указанные
					на сайте ForestMusic, если они там опубликованы.
				</p>
				<p>
					Исходный код:{' '}
					<a
						href={SOCIAL.github}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{SOCIAL.github}
					</a>
				</p>
			</Prose>
		</div>
	)
}
