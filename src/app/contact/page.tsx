import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	PROJECT_BRAND,
	PROJECT_URL,
	SITE_NAME,
	SOCIAL,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Контакты',
	description: `Публичный контакт ${SITE_NAME}: сайт проекта ${PROJECT_BRAND} — ${PROJECT_URL.replace('https://', '')}.`,
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
					{SITE_NAME} разработан в рамках проекта{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_BRAND}
					</a>
					. {PROJECT_BRAND} указывается как проект и сайт разработчика, а не как
					юридическое лицо.
				</p>
				<p>
					Единственный публичный контакт:{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_URL}
					</a>
					. Email, телефон, почтовый адрес и реквизиты на этом сайте не
					публикуются.
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
