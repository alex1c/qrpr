import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для PDF и файлов',
	description: 'Создайте QR на публичную HTTPS-ссылку документа. Загрузка файлов на сервер не выполняется.',
	path: '/qr-pdf',
})

export default function Page () {
	return (
		<ToolPage
			toolId="pdf"
			title="Генератор QR-кода для PDF и файлов"
			intro="Статический MVP не может сделать локальный файл доступным в интернете. Сначала опубликуйте документ по HTTPS, затем закодируйте ссылку."
			howTo={['Опубликуйте файл (облако, сайт, объектное хранилище).', 'Вставьте HTTPS-ссылку.', 'Скачайте QR.']}
			limits={['Только HTTPS.', 'Файлы на сервер QR-PR не загружаются.', 'Доступность зависит от вашей ссылки и прав доступа.']}
		/>
	)
}
