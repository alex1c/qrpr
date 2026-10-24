import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода события календаря',
	description: 'Сформируйте iCalendar VEVENT в QR: название, даты, место и описание.',
	path: '/qr-event',
})

export default function Page () {
	return (
		<ToolPage
			toolId="event"
			title="Генератор QR-кода события календаря"
			intro="Событие сериализуется в UTC. Совместимость со всеми календарными приложениями не гарантируется."
			howTo={['Заполните название и интервал времени.', 'Добавьте место и описание.', 'Скачайте и протестируйте на своём календаре.']}
			limits={['Разные клиенты по-разному обрабатывают ICS из QR.', 'Часовые пояса приводятся к UTC при кодировании.']}
		/>
	)
}
