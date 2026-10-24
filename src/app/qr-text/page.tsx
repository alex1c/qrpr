import { ToolPage } from '@/components/seo/tool-page'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Генератор QR-кода из текста',
	description: 'Закодируйте произвольный текст с кириллицей и переносами строк в QR-код. Бесплатно и без регистрации.',
	path: '/qr-text',
})

export default function Page () {
	return (
		<ToolPage
			toolId="text"
			title="Генератор QR-кода из текста"
			intro="Подойдёт для заметок, промокодов, инструкций и любого Unicode-текста. Переносы строк сохраняются."
			howTo={['Введите текст.', 'При необходимости настройте оформление.', 'Скачайте нужный формат.']}
			limits={['Очень длинный текст увеличивает плотность QR и может хуже сканироваться.', 'Мягкий лимит — около 2000 символов.']}
		/>
	)
}
