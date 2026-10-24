/**
 * Shared SEO page chrome: breadcrumbs, intro, FAQ, related links.
 */
import Link from 'next/link'
import {
	JsonLd,
	breadcrumbJsonLd,
	faqJsonLd,
} from '@/lib/seo/json-ld'
import { SITE_NAME } from '@/config/site'

export function Breadcrumbs ({
	items,
}: {
	items: Array<{ name: string; path: string }>
}) {
	return (
		<>
			<JsonLd
				data={breadcrumbJsonLd([
					{ name: SITE_NAME, path: '/' },
					...items,
				])}
			/>
			<nav aria-label="Хлебные крошки" className="mb-6 text-sm text-[var(--ink-muted)]">
				<ol className="flex flex-wrap items-center gap-1.5">
					<li>
						<Link href="/" className="hover:text-[var(--accent)]">
							Главная
						</Link>
					</li>
					{items.map((item) => (
						<li key={item.path} className="flex items-center gap-1.5">
							<span aria-hidden>/</span>
							<Link href={item.path} className="hover:text-[var(--accent)]">
								{item.name}
							</Link>
						</li>
					))}
				</ol>
			</nav>
		</>
	)
}

export function FaqSection ({
	items,
	withJsonLd = true,
}: {
	items: Array<{ question: string; answer: string }>
	withJsonLd?: boolean
}) {
	return (
		<section className="mt-16" aria-labelledby="faq-heading">
			{withJsonLd ? <JsonLd data={faqJsonLd(items)} /> : null}
			<h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--ink)]">
				Частые вопросы
			</h2>
			<div className="space-y-3">
				{items.map((item) => (
					<details
						key={item.question}
						className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
					>
						<summary className="cursor-pointer list-none font-medium text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
							<span className="flex items-center justify-between gap-3">
								{item.question}
								<span className="text-[var(--ink-muted)] transition group-open:rotate-45">
									+
								</span>
							</span>
						</summary>
						<p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
							{item.answer}
						</p>
					</details>
				))}
			</div>
		</section>
	)
}

export function Prose ({ children }: { children: React.ReactNode }) {
	return (
		<div className="max-w-3xl space-y-4 text-[var(--ink-muted)] leading-relaxed">
			{children}
		</div>
	)
}
