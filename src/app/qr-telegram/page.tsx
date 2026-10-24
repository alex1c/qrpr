import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для Telegram',
	description: 'Сделайте QR для профиля, канала или публичного чата Telegram по username или ссылке t.me.',
	path: '/qr-telegram',
})

export default function Page () {
	return (
		<ToolPage
			toolId="telegram"
			title="Генератор QR-кода для Telegram"
			intro="Подходят @username и ссылки t.me / telegram.me. Приватные чаты и закрытые invite без публичной ссылки не гарантируются."
			howTo={['Введите username или ссылку.', 'Проверьте, что открывается нужный ресурс.', 'Скачайте QR.']}
			limits={['Приватные и закрытые ресурсы могут быть недоступны.', 'Нужен установленный Telegram или веб-клиент.']}
		/>
	)
}
