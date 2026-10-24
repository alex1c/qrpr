import { AnalyticsConsentControls } from '@/components/analytics/consent-banner'
import { Breadcrumbs, Prose } from '@/components/seo/page-shell'
import {
	PROJECT_BRAND,
	PROJECT_URL,
	SITE_NAME,
	SITE_URL,
} from '@/config/site'
import { YANDEX_METRIKA_ID } from '@/config/analytics'
import { buildPageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = buildPageMetadata({
	title: 'Политика конфиденциальности',
	description:
		'Как QR-PR обрабатывает данные: локальная генерация QR, согласие на Яндекс Метрику и ограничение передачи содержимого инструментов.',
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
					Сервис {SITE_NAME} ({SITE_URL}) развивается в рамках проекта{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_BRAND}
					</a>
					. Полные юридические реквизиты оператора на этой странице не
					публикуются. Контактный ориентир — сайт проекта:{' '}
					<a
						href={PROJECT_URL}
						className="text-[var(--accent)] hover:underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						{PROJECT_URL}
					</a>
					.
				</p>

				<h2 className="!mt-8 text-xl font-bold text-[var(--ink)]">
					Данные инструментов QR
				</h2>
				<p>
					Статические QR-коды создаются локально в браузере. Содержимое полей
					(включая пароли Wi‑Fi, визитки, сообщения, номера телефонов),
					загруженные изображения и сгенерированные коды не отправляются на
					сервер {SITE_NAME} автоматически и не передаются в аналитику как
					пользовательский контент.
				</p>

				<h2 className="!mt-8 text-xl font-bold text-[var(--ink)]">
					Локальные настройки
				</h2>
				<p>
					В браузере может сохраняться предпочтение темы оформления и решение о
					согласии / отказе от аналитики (локальное хранилище).
				</p>

				<h2 className="!mt-8 text-xl font-bold text-[var(--ink)]">
					Яндекс Метрика
				</h2>
				<p>
					На сайте может использоваться Яндекс Метрика (счётчик №{' '}
					{YANDEX_METRIKA_ID}) для оценки посещаемости: просмотры страниц и
					переходы по ссылкам. Вебвизор и карта кликов отключены в настройках
					интеграции.
				</p>
				<p>
					Скрипт Метрики <strong>не загружается</strong>, пока вы явно не дадите
					согласие. При отказе решение сохраняется и соблюдается; его можно
					изменить ниже. После согласия браузер может получать cookies и
					отправлять технические запросы на серверы Яндекса (включая сведения о
					устройстве, IP, URL страницы без query-параметров в наших hit-вызовах,
					User-Agent и подобные технические данные). Обработка на стороне
					Яндекса регулируется их документацией и политикой.
				</p>
				<p>
					Мы не настраиваем передачу в Метрику содержимого QR-кодов, паролей
					Wi‑Fi, контактов из форм, текста сообщений, загруженных изображений и
					значений полей генератора. Не включаем автоматический сбор содержимого
					форм с персональными данными.
				</p>
				<p>
					Посетители из разных стран могут иметь разные ожидания и требования к
					согласиям на cookies / аналитику. Этот механизм даёт opt-in до загрузки
					счётчика; он не заменяет индивидуальную юридическую консультацию и не
					утверждает соответствие конкретному закону какой-либо страны.
				</p>

				<h2 className="!mt-8 text-xl font-bold text-[var(--ink)]">
					Серверные логи
				</h2>
				<p>
					Инфраструктура хостинга может вести технические логи запросов
					(например, IP и User-Agent) в объёме, необходимом для работы сайта.
				</p>

				<p>
					См. также{' '}
					<Link href="/terms" className="text-[var(--accent)] hover:underline">
						условия использования
					</Link>{' '}
					и{' '}
					<Link href="/contact" className="text-[var(--accent)] hover:underline">
						контакты
					</Link>
					.
				</p>
			</Prose>

			<div className="mt-8">
				<h2 className="mb-3 text-xl font-bold text-[var(--ink)]">
					Управление согласием на аналитику
				</h2>
				<AnalyticsConsentControls />
			</div>
		</div>
	)
}
