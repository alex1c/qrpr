/**
 * Shared layout for dedicated QR tool SEO pages.
 */
import { QrGeneratorLazy } from '@/components/qr/qr-generator-lazy'
import { Breadcrumbs, FaqSection, Prose } from '@/components/seo/page-shell'
import { toolFaq } from '@/lib/seo/faq-content'
import type { QrToolId } from '@/types/qr'
import Link from 'next/link'
import { QR_TOOLS } from '@/config/tools'

export function ToolPage ({
	toolId,
	title,
	intro,
	howTo,
	limits,
	related,
	forceLogoHint,
	path,
}: {
	toolId: QrToolId
	title: string
	intro: string
	howTo: string[]
	limits: string[]
	related?: Array<{ href: string; label: string }>
	forceLogoHint?: boolean
	/** Canonical path for breadcrumbs (defaults to tool slug). */
	path?: string
}) {
	const faq = toolFaq(title)
	const crumbPath = path ?? `/${getSlug(toolId)}`

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
			<Breadcrumbs items={[{ name: title, path: crumbPath }]} />
			<h1 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
				{title}
			</h1>
			<Prose>
				<p>{intro}</p>
			</Prose>

			<div className="my-10">
				<QrGeneratorLazy
					initialType={toolId}
					lockType
					showTypeNav={false}
					forceLogoHint={forceLogoHint}
				/>
			</div>

			<section className="mb-10 space-y-3">
				<h2 className="text-xl font-bold text-[var(--ink)]">Как пользоваться</h2>
				<ol className="list-decimal space-y-2 pl-5 text-[var(--ink-muted)]">
					{howTo.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ol>
			</section>

			<section className="mb-10 space-y-3">
				<h2 className="text-xl font-bold text-[var(--ink)]">Ограничения</h2>
				<ul className="list-disc space-y-2 pl-5 text-[var(--ink-muted)]">
					{limits.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>

			{(related?.length || QR_TOOLS.length) ? (
				<section className="mb-6">
					<h2 className="mb-3 text-xl font-bold text-[var(--ink)]">Смотрите также</h2>
					<ul className="flex flex-wrap gap-2">
						{(related ??
							QR_TOOLS.filter((t) => t.id !== toolId)
								.slice(0, 6)
								.map((t) => ({ href: t.href, label: t.shortTitle }))
						).map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
								>
									{item.label}
								</Link>
							</li>
						))}
						<li>
							<Link
								href="/generator"
								className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
							>
								Все типы
							</Link>
						</li>
					</ul>
				</section>
			) : null}

			<FaqSection items={faq} />
		</div>
	)
}

function getSlug (toolId: QrToolId): string {
	const map: Record<QrToolId, string> = {
		url: 'qr-url',
		text: 'qr-text',
		wifi: 'qr-wifi',
		vcard: 'qr-vcard',
		email: 'qr-email',
		phone: 'qr-phone',
		sms: 'qr-sms',
		telegram: 'qr-telegram',
		whatsapp: 'qr-whatsapp',
		location: 'qr-location',
		event: 'qr-event',
		pdf: 'qr-pdf',
	}
	return map[toolId]
}
