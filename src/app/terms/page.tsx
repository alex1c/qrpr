import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	PROJECT_BRAND,
	PROJECT_URL,
	SITE_NAME,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = buildPageMetadata({
	title: 'Условия использования',
	description:
		'Условия использования сервиса QR-PR: бесплатные инструменты «как есть», ответственность пользователя за содержимое QR.',
	path: '/terms',
})

export default function TermsPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Условия', path: '/terms' }]} />
			<h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
				Условия использования
			</h1>
			<Prose>
				<p>
					Сервис {SITE_NAME} предоставляется в рамках проекта{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_BRAND}
					</a>{' '}
					(
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_URL}
					</a>
					). Название проекта не используется здесь как подтверждённое
					юридическое лицо. Полные реквизиты оператора на сайте не опубликованы.
				</p>
				<p>
					{SITE_NAME} предоставляет инструменты для создания, оформления,
					считывания и базовой проверки QR-кодов. Сервис предоставляется «как
					есть», без гарантий бесперебойной работы и совместимости со всеми
					устройствами и приложениями.
				</p>
				<p>
					Вы несёте ответственность за содержимое, которое кодируете (включая
					ссылки, пароли и персональные данные). Не используйте сервис для
					вредоносной, мошеннической или иной незаконной деятельности.
				</p>
				<p>
					Проверка QR не является антивирусной экспертизой и не подтверждает
					безопасность внешних ресурсов. Сканер не открывает ссылки
					автоматически.
				</p>
				<p>
					Использование необязательной аналитики (Яндекс Метрика) описано в{' '}
					<Link href="/privacy" className="text-[var(--accent)] hover:underline">
						политике конфиденциальности
					</Link>{' '}
					и возможно только после вашего согласия.
				</p>
				<p>
					Продолжая пользоваться сайтом, вы принимаете актуальную версию этого
					документа. Контакты — на странице{' '}
					<Link href="/contact" className="text-[var(--accent)] hover:underline">
						/contact
					</Link>
					.
				</p>
			</Prose>
		</div>
	)
}
