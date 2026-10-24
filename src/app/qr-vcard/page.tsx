import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-визитки vCard',
	description: 'Создайте электронную визитку vCard в QR-коде: имя, телефон, email, компания и адрес.',
	path: '/qr-vcard',
})

export default function Page () {
	return (
		<ToolPage
			toolId="vcard"
			title="Генератор QR-визитки vCard"
			intro="vCard удобно сохранять в контакты телефона. Формируется корректная карточка с экранированием спецсимволов."
			howTo={['Заполните имя или фамилию и нужные поля.', 'Проверьте предпросмотр.', 'Экспортируйте файл.']}
			limits={['Не все приложения поддерживают все поля vCard одинаково.', 'Это статическая визитка — изменить данные позже можно только новым QR.']}
		/>
	)
}
