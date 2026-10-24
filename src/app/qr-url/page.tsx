import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для ссылки',
	description: 'Создайте QR-код для HTTP/HTTPS ссылки бесплатно. Мгновенный предпросмотр, PNG, SVG и PDF без водяных знаков.',
	path: '/qr-url',
})

export default function Page () {
	return (
		<ToolPage
			toolId="url"
			title="Генератор QR-кода для ссылки"
			intro="Закодируйте любую веб-ссылку в статический QR-код. Подходят HTTP и HTTPS. Если схема не указана, для удобства добавляется https:// — исходный путь и параметры сохраняются."
			howTo={['Вставьте URL.', 'Проверьте предпросмотр.', 'Скачайте PNG, SVG или PDF.']}
			limits={['Только HTTP/HTTPS.', 'Работоспособность зависит от доступности самой ссылки.', 'Данные не сокращаются и не проксируются через QR-PR.']}
		/>
	)
}
