import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода геолокации',
	description: 'Закодируйте широту и долготу в ссылку на карту OpenStreetMap.',
	path: '/qr-location',
})

export default function Page () {
	return (
		<ToolPage
			toolId="location"
			title="Генератор QR-кода геолокации"
			intro="Координаты проверяются по диапазонам. В QR попадает открытая ссылка на карту."
			howTo={['Укажите широту и долготу.', 'Проверьте предпросмотр.', 'Скачайте QR.']}
			limits={['Точность зависит от указанных координат.', 'Картографическое приложение выбирает устройство пользователя.']}
		/>
	)
}
