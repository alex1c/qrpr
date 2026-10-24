import Link from 'next/link'
import { QrGeneratorLazy } from '@/components/qr/qr-generator-lazy'
import { FaqSection, Prose } from '@/components/seo/page-shell'
import { QR_TOOLS, EXTRA_TOOL_PAGES } from '@/config/tools'
import { COMMON_FAQ } from '@/lib/seo/faq-content'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_DESCRIPTION, SITE_NAME } from '@/config/site'

export const metadata = buildPageMetadata({
	title: `${SITE_NAME} — бесплатный генератор QR-кодов`,
	description: SITE_DESCRIPTION,
	path: '/',
})

const BENEFITS = [
	{
		title: 'Без регистрации',
		text: 'Открыли сайт — сразу создаёте QR. Аккаунт не нужен.',
	},
	{
		title: 'Без водяных знаков',
		text: 'Экспортируйте чистый PNG, SVG или PDF для печати и экрана.',
	},
	{
		title: 'Локально в браузере',
		text: 'Статические коды собираются на устройстве. Данные не уходят на сервер автоматически.',
	},
	{
		title: 'Мгновенный предпросмотр',
		text: 'Меняете текст или оформление — QR обновляется сразу.',
	},
]

export default function HomePage () {
	return (
		<>
			<section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
				<div className="mb-10 max-w-2xl animate-fade-up">
					<p className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
						QR-PR
					</p>
					<h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl">
						Создайте QR-код за несколько секунд
					</h1>
					<p className="mt-4 text-lg text-[var(--ink-muted)]">
						Бесплатные статические QR-коды: ссылки, Wi‑Fi, визитки, мессенджеры и ещё.
						Без регистрации, без водяных знаков, без срока действия.
					</p>
				</div>
				<div className="animate-fade-up-delay">
					<QrGeneratorLazy initialType="url" />
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="tools-heading">
				<h2 id="tools-heading" className="mb-2 text-2xl font-bold text-[var(--ink)]">
					Каталог инструментов
				</h2>
				<p className="mb-8 max-w-2xl text-[var(--ink-muted)]">
					Отдельные страницы под каждый тип QR — с инструкцией и генератором.
				</p>
				<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{QR_TOOLS.map((tool) => (
						<li key={tool.id}>
							<Link
								href={tool.href}
								className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								<span className="font-semibold text-[var(--ink)]">{tool.shortTitle}</span>
								<span className="mt-1 block text-sm text-[var(--ink-muted)]">
									{tool.description}
								</span>
							</Link>
						</li>
					))}
					{EXTRA_TOOL_PAGES.filter((p) =>
						['scan', 'check', 'qr-with-logo'].includes(p.slug),
					).map((page) => (
						<li key={page.slug}>
							<Link
								href={page.href}
								className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								<span className="font-semibold text-[var(--ink)]">{page.shortTitle}</span>
								<span className="mt-1 block text-sm text-[var(--ink-muted)]">
									{page.description}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="benefits-heading">
				<h2 id="benefits-heading" className="mb-8 text-2xl font-bold text-[var(--ink)]">
					Почему QR-PR
				</h2>
				<ul className="grid gap-6 sm:grid-cols-2">
					{BENEFITS.map((item) => (
						<li key={item.title} className="space-y-2">
							<h3 className="text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
							<p className="text-[var(--ink-muted)]">{item.text}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<Prose>
					<h2 className="text-2xl font-bold text-[var(--ink)]">О статическом QR-коде</h2>
					<p>
						Статический QR хранит данные внутри самого изображения. Его не нужно
						«продлевать» и нельзя внезапно отключить со стороны сервиса генерации.
						Если вы закодировали ссылку, работоспособность зависит от самой ссылки —
						а не от QR-PR.
					</p>
					<p>
						В будущем появятся пакетная генерация и динамические QR для бизнеса.
						Сейчас фокус — быстрый, приватный и качественный MVP для повседневных задач.
					</p>
				</Prose>
			</section>

			<div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
				<FaqSection items={[...COMMON_FAQ]} />
			</div>
		</>
	)
}
