import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для WhatsApp',
	description: 'Создайте wa.me QR с международным номером и опциональным сообщением.',
	path: '/qr-whatsapp',
})

export default function Page () {
	return (
		<ToolPage
			toolId="whatsapp"
			title="Генератор QR-кода для WhatsApp"
			intro="Формируется ссылка https://wa.me/… Номер указывается цифрами без знака +."
			howTo={['Введите международный номер.', 'Добавьте сообщение при необходимости.', 'Скачайте QR.']}
			limits={['Номер должен существовать в WhatsApp.', 'Требуется приложение или WhatsApp Web.']}
		/>
	)
}
