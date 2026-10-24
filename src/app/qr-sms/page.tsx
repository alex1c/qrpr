import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для SMS',
	description: 'Закодируйте номер и текст SMS в QR-код для быстрого открытия сообщения.',
	path: '/qr-sms',
})

export default function Page () {
	return (
		<ToolPage
			toolId="sms"
			title="Генератор QR-кода для SMS"
			intro="Используется схема sms: с параметром body — широко поддерживается на мобильных устройствах."
			howTo={['Укажите номер.', 'Добавьте текст сообщения при необходимости.', 'Скачайте QR.']}
			limits={['Отправка SMS может тарифицироваться оператором.', 'Длина сообщения влияет на размер QR.']}
		/>
	)
}
