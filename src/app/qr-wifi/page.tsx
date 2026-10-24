import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода для Wi‑Fi',
	description: 'Сформируйте QR для подключения к Wi‑Fi: SSID, пароль, WPA/WPA2/WPA3, скрытая сеть.',
	path: '/qr-wifi',
})

export default function Page () {
	return (
		<ToolPage
			toolId="wifi"
			title="Генератор QR-кода для Wi‑Fi"
			intro="Гости смогут подключиться к сети, отсканировав код. Поддерживаются WPA/WPA2/WPA3 (формат T:WPA), WEP и открытые сети."
			howTo={['Укажите SSID и тип защиты.', 'Введите пароль (кроме открытой сети).', 'Скачайте QR и разместите его там, где пароль можно показывать.']}
			limits={['Пароль может храниться в QR в открытом виде.', 'Совместимость зависит от устройства и ОС.', 'Не публикуйте QR с паролем в открытом доступе без необходимости.']}
		/>
	)
}
