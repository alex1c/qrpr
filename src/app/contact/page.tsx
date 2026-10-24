import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	CONTACT_EMAIL_PLACEHOLDER,
	LEGAL_ADDRESS_PLACEHOLDER,
	LEGAL_ENTITY_PLACEHOLDER,
	SOCIAL,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Контакты',
	description: 'Контактные данные QR-PR. Реквизиты будут заполнены владельцем проекта.',
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
					Владелец / оператор: <strong>{LEGAL_ENTITY_PLACEHOLDER}</strong>
				</p>
				<p>
					Email: <strong>{CONTACT_EMAIL_PLACEHOLDER}</strong>
				</p>
				<p>
					Адрес: <strong>{LEGAL_ADDRESS_PLACEHOLDER}</strong>
				</p>
				<p>
					Репозиторий:{' '}
					<a
						href={SOCIAL.github}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{SOCIAL.github}
					</a>
				</p>
				<p>
					Поля с пометкой «указать…» намеренно оставлены пустыми-заглушками без
					вымышленных данных — заполните их перед публичным запуском.
				</p>
			</Prose>
		</div>
	)
}
