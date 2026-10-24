/**
 * Site footer with tool links and legal pages.
 */
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { QR_TOOLS, EXTRA_TOOL_PAGES } from '@/config/tools'
import {
	PROJECT_DEVELOPER_LABEL,
	PROJECT_LINK_LABEL,
	PROJECT_URL,
	SITE_TAGLINE,
} from '@/config/site'

export function Footer () {
	return (
		<footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface-muted)]">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
				<div className="space-y-3">
					<Logo />
					<p className="max-w-xs text-sm text-[var(--ink-muted)]">{SITE_TAGLINE}</p>
					<p className="text-sm text-[var(--ink-muted)]">
						<a
							href={PROJECT_URL}
							className="text-[var(--accent)] hover:underline"
							rel="noopener noreferrer"
							target="_blank"
						>
							{PROJECT_DEVELOPER_LABEL}
						</a>
					</p>
				</div>
				<div>
					<p className="mb-3 text-sm font-semibold text-[var(--ink)]">Инструменты</p>
					<ul className="columns-2 gap-x-6 space-y-2 text-sm text-[var(--ink-muted)]">
						{QR_TOOLS.slice(0, 8).map((tool) => (
							<li key={tool.id}>
								<Link href={tool.href} className="hover:text-[var(--accent)]">
									{tool.shortTitle}
								</Link>
							</li>
						))}
						{EXTRA_TOOL_PAGES.filter((p) => p.slug !== 'generator').map((page) => (
							<li key={page.slug}>
								<Link href={page.href} className="hover:text-[var(--accent)]">
									{page.shortTitle}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<p className="mb-3 text-sm font-semibold text-[var(--ink)]">Информация</p>
					<ul className="space-y-2 text-sm text-[var(--ink-muted)]">
						<li>
							<Link href="/about" className="hover:text-[var(--accent)]">
								О сервисе
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:text-[var(--accent)]">
								Контакты
							</Link>
						</li>
						<li>
							<Link href="/privacy" className="hover:text-[var(--accent)]">
								Конфиденциальность
							</Link>
						</li>
						<li>
							<Link href="/terms" className="hover:text-[var(--accent)]">
								Условия использования
							</Link>
						</li>
						<li>
							<a
								href={PROJECT_URL}
								className="hover:text-[var(--accent)]"
								rel="noopener noreferrer"
								target="_blank"
							>
								{PROJECT_LINK_LABEL}
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--ink-faint)]">
				© 2026 QR-PR · qr-pr.ru
			</div>
		</footer>
	)
}
