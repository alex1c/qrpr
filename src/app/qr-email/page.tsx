import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для Email',
	description: 'Сформируйте mailto QR с адресом, темой и текстом письма.',
	path: '/qr-email',
})

export default function Page () {
	return (
		<ToolPage
			toolId="email"
			title="Генератор QR-кода для Email"
			intro="После сканирования устройство может открыть почтовый клиент с заполненными полями."
			howTo={['Укажите email.', 'При желании добавьте тему и текст.', 'Скачайте QR.']}
			limits={['Поведение зависит от почтового приложения на устройстве.', 'Большие письма увеличивают размер QR.']}
		/>
	)
}
