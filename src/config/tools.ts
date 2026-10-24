/**
 * Catalog of QR tools — single source for nav, SEO pages, and generator tabs.
 */
import type { QrToolId } from '@/types/qr'

export interface QrToolDefinition {
	id: QrToolId
	slug: string
	href: string
	title: string
	shortTitle: string
	description: string
	/** H1 for dedicated SEO page */
	h1: string
	keywords: string[]
}

export const QR_TOOLS: QrToolDefinition[] = [
	{
		id: 'url',
		slug: 'qr-url',
		href: '/qr-url',
		title: 'QR-код для ссылки (URL)',
		shortTitle: 'Ссылка',
		description:
			'Создайте QR-код для любой HTTP/HTTPS-ссылки. Мгновенный предпросмотр и экспорт без водяных знаков.',
		h1: 'Генератор QR-кода для ссылки',
		keywords: ['qr url', 'qr ссылка', 'генератор qr'],
	},
	{
		id: 'text',
		slug: 'qr-text',
		href: '/qr-text',
		title: 'QR-код из текста',
		shortTitle: 'Текст',
		description:
			'Закодируйте произвольный текст, включая кириллицу и переносы строк, в статический QR-код.',
		h1: 'Генератор QR-кода из текста',
		keywords: ['qr текст', 'текстовый qr'],
	},
	{
		id: 'wifi',
		slug: 'qr-wifi',
		href: '/qr-wifi',
		title: 'QR-код для Wi‑Fi',
		shortTitle: 'Wi‑Fi',
		description:
			'Сформируйте QR для быстрого подключения к сети: SSID, пароль, тип защиты и скрытая сеть.',
		h1: 'Генератор QR-кода для Wi‑Fi',
		keywords: ['qr wifi', 'qr wi-fi', 'подключение к wifi'],
	},
	{
		id: 'vcard',
		slug: 'qr-vcard',
		href: '/qr-vcard',
		title: 'QR-визитка (vCard)',
		shortTitle: 'Визитка',
		description:
			'Создайте электронную визитку vCard с контактами, компанией и адресом.',
		h1: 'Генератор QR-визитки vCard',
		keywords: ['qr визитка', 'vcard qr'],
	},
	{
		id: 'email',
		slug: 'qr-email',
		href: '/qr-email',
		title: 'QR-код для Email',
		shortTitle: 'Email',
		description:
			'Сформируйте mailto-ссылку с адресом, темой и текстом письма в QR-коде.',
		h1: 'Генератор QR-кода для Email',
		keywords: ['qr email', 'mailto qr'],
	},
	{
		id: 'phone',
		slug: 'qr-phone',
		href: '/qr-phone',
		title: 'QR-код для телефона',
		shortTitle: 'Телефон',
		description:
			'Создайте tel-ссылку для быстрого набора номера с международным префиксом.',
		h1: 'Генератор QR-кода для телефона',
		keywords: ['qr телефон', 'tel qr'],
	},
	{
		id: 'sms',
		slug: 'qr-sms',
		href: '/qr-sms',
		title: 'QR-код для SMS',
		shortTitle: 'SMS',
		description:
			'Закодируйте номер и текст SMS для быстрого открытия сообщения на телефоне.',
		h1: 'Генератор QR-кода для SMS',
		keywords: ['qr sms', 'смс qr'],
	},
	{
		id: 'telegram',
		slug: 'qr-telegram',
		href: '/qr-telegram',
		title: 'QR-код для Telegram',
		shortTitle: 'Telegram',
		description:
			'Сделайте QR для профиля, канала или публичного чата Telegram по username или ссылке.',
		h1: 'Генератор QR-кода для Telegram',
		keywords: ['qr telegram', 'телеграм qr'],
	},
	{
		id: 'whatsapp',
		slug: 'qr-whatsapp',
		href: '/qr-whatsapp',
		title: 'QR-код для WhatsApp',
		shortTitle: 'WhatsApp',
		description:
			'Создайте ссылку wa.me с международным номером и опциональным сообщением.',
		h1: 'Генератор QR-кода для WhatsApp',
		keywords: ['qr whatsapp', 'wa.me qr'],
	},
	{
		id: 'location',
		slug: 'qr-location',
		href: '/qr-location',
		title: 'QR-код геолокации',
		shortTitle: 'Гео',
		description:
			'Закодируйте координаты широты и долготы в ссылку на карту.',
		h1: 'Генератор QR-кода геолокации',
		keywords: ['qr геолокация', 'qr карта'],
	},
	{
		id: 'event',
		slug: 'qr-event',
		href: '/qr-event',
		title: 'QR-код события календаря',
		shortTitle: 'Событие',
		description:
			'Сформируйте событие календаря (iCalendar) с названием, датами, местом и описанием.',
		h1: 'Генератор QR-кода события календаря',
		keywords: ['qr событие', 'ical qr', 'календарь qr'],
	},
	{
		id: 'pdf',
		slug: 'qr-pdf',
		href: '/qr-pdf',
		title: 'QR-код для PDF и файлов',
		shortTitle: 'PDF / файл',
		description:
			'Создайте QR на публичную HTTPS-ссылку документа. Файл должен быть уже опубликован в интернете.',
		h1: 'Генератор QR-кода для PDF и файлов',
		keywords: ['qr pdf', 'qr файл'],
	},
]

export const EXTRA_TOOL_PAGES = [
	{
		slug: 'qr-with-logo',
		href: '/qr-with-logo',
		title: 'QR-код с логотипом',
		shortTitle: 'С логотипом',
		description:
			'Добавьте логотип в центр QR-кода с безопасным размером и повышенным уровнем коррекции ошибок.',
		h1: 'Генератор QR-кода с логотипом',
	},
	{
		slug: 'generator',
		href: '/generator',
		title: 'Онлайн-генератор QR-кодов',
		shortTitle: 'Генератор',
		description:
			'Универсальный генератор статических QR-кодов: все типы данных, оформление и экспорт PNG, SVG, PDF.',
		h1: 'Онлайн-генератор QR-кодов',
	},
	{
		slug: 'scan',
		href: '/scan',
		title: 'Сканер QR-кодов онлайн',
		shortTitle: 'Сканер',
		description:
			'Считайте QR из изображения или камеры прямо в браузере. Данные не загружаются на сервер.',
		h1: 'Сканер QR-кодов онлайн',
	},
	{
		slug: 'check',
		href: '/check',
		title: 'Проверка QR-кода',
		shortTitle: 'Проверка',
		description:
			'Проверьте, распознаётся ли QR-код, какой тип данных внутри и как выглядит URL. Это не антивирус.',
		h1: 'Проверка QR-кода',
	},
] as const

export function getToolById (id: QrToolId): QrToolDefinition {
	const tool = QR_TOOLS.find((item) => item.id === id)
	if (!tool) {
		throw new Error(`Unknown QR tool: ${id}`)
	}
	return tool
}

export function getToolBySlug (slug: string): QrToolDefinition | undefined {
	return QR_TOOLS.find((item) => item.slug === slug)
}
