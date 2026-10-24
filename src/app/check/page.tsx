import { QrScannerLazy } from '@/components/scanner/qr-scanner-lazy'
import { Breadcrumbs, FaqSection, Prose } from '@/components/seo/page-shell'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
	title: 'Проверка QR-кода',
	description:
		'Проверьте, распознаётся ли QR-код, какой тип данных внутри и как выглядит URL. Это не антивирус и не проверка репутации.',
	path: '/check',
})

const FAQ = [
	{
		question: 'Это антивирус?',
		answer:
			'Нет. Сервис только читает содержимое QR и делает структурный разбор URL. Репутация сайта не проверяется.',
	},
	{
		question: 'Делаете ли вы запросы к найденным ссылкам?',
		answer:
			'Нет. Неизвестные адреса не запрашиваются автоматически с сервера.',
	},
	{
		question: 'Что означает «корректный URL»?',
		answer:
			'Только то, что строка разобрана как URL. Это не означает, что ресурс безопасен.',
	},
]

export default function CheckPage () {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: 'Проверка', path: '/check' }]} />
			<h1 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
				Проверка QR-кода
			</h1>
			<Prose>
				<p>
					Загрузите изображение QR. Мы покажем, удалось ли распознать код, тип
					данных, длину содержимого и предупреждения по структуре ссылки — без
					утверждений о «безопасности сайта».
				</p>
			</Prose>
			<div className="my-10">
				<QrScannerLazy mode="check" />
			</div>
			<FaqSection items={FAQ} />
		</div>
	)
}
