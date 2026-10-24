import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	CONTACT_EMAIL_PLACEHOLDER,
	LEGAL_ENTITY_PLACEHOLDER,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'

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
					Сервис предоставляется {LEGAL_ENTITY_PLACEHOLDER}. Связь:{' '}
					{CONTACT_EMAIL_PLACEHOLDER}.
				</p>
				<p>
					QR-PR предоставляет инструменты для создания, оформления, считывания и
					базовой проверки QR-кодов. Сервис предоставляется «как есть», без
					гарантий бесперебойной работы и совместимости со всеми устройствами и
					приложениями.
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
					Условия будут обновлены после указания полных реквизитов владельца.
					Продолжая пользоваться сайтом, вы принимаете актуальную версию этого
					документа.
				</p>
			</Prose>
		</div>
	)
}
