import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для телефона',
	description: 'Создайте tel-ссылку в QR для быстрого набора номера с международным префиксом.',
	path: '/qr-phone',
})

export default function Page () {
	return (
		<ToolPage
			toolId="phone"
			title="Генератор QR-кода для телефона"
			intro="Номер кодируется как tel: URI. Международный префикс «+» сохраняется."
			howTo={['Введите номер.', 'Проверьте предпросмотр.', 'Скачайте QR.']}
			limits={['Набор номера зависит от телефонного приложения.', 'Форматирующие пробелы убираются из URI, цифры и + сохраняются.']}
		/>
	)
}
