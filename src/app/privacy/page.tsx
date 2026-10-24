import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	CONTACT_EMAIL_PLACEHOLDER,
	LEGAL_ENTITY_PLACEHOLDER,
} from '@/config/site'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Политика конфиденциальности',
	description:
		'Как QR-PR обрабатывает данные: локальная генерация QR, отсутствие маркетинговых cookies и телеметрии в MVP.',
	path: '/privacy',
})

export default function PrivacyPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Конфиденциальность', path: '/privacy' }]} />
			<h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
				Политика конфиденциальности
			</h1>
			<Prose>
				<p>
					Оператор сервиса: {LEGAL_ENTITY_PLACEHOLDER}. Контакт:{' '}
					{CONTACT_EMAIL_PLACEHOLDER}.
				</p>
				<p>
					Статические QR-коды создаются локально в браузере. Содержимое полей
					(включая пароли Wi‑Fi, визитки и сообщения), загруженные изображения и
					сгенерированные коды не сохраняются на сервере и не логируются как
					пользовательский контент в рамках текущего MVP.
				</p>
				<p>
					В браузере может сохраняться только предпочтение темы оформления
					(светлая/тёмная) в локальном хранилище.
				</p>
				<p>
					Маркетинговые cookies, рекламные SDK и сторонняя аналитика в MVP не
					подключаются. Технические логи веб-сервера (например, IP и User-Agent
					при запросе страниц) могут вестись инфраструктурой хостинга в объёме,
					необходимом для работы сайта.
				</p>
				<p>
					Документ будет уточнён после заполнения реквизитов оператора. Не
					используйте сервис для передачи особо чувствительных данных, если вам
					нужна отдельная договорная обработка.
				</p>
			</Prose>
		</div>
	)
}
