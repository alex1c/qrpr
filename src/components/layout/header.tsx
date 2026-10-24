'use client'

/**
 * Site header with logo, primary nav, and theme toggle.
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils/cn'

const NAV = [
	{ href: '/generator', label: 'Генератор' },
	{ href: '/scan', label: 'Сканер' },
	{ href: '/check', label: 'Проверка' },
	{ href: '/about', label: 'О сервисе' },
]

export function Header () {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	return (
		<header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<Logo />
				<nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
					{NAV.map((item) => {
						const active =
							pathname === item.href || pathname.startsWith(`${item.href}/`)
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
									active
										? 'text-[var(--accent)]'
										: 'text-[var(--ink-muted)] hover:text-[var(--ink)]',
								)}
							>
								{item.label}
							</Link>
						)
					})}
				</nav>
				<div className="flex items-center gap-1">
					<ThemeToggle />
					<button
						type="button"
						className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
						aria-expanded={open}
						aria-controls="mobile-nav"
						aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
						onClick={() => setOpen((v) => !v)}
					>
						{open ? <CloseIcon /> : <MenuIcon />}
					</button>
				</div>
			</div>
			{open ? (
				<nav
					id="mobile-nav"
					className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 md:hidden"
					aria-label="Мобильная навигация"
				>
					<ul className="flex flex-col gap-1">
						{NAV.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="block rounded-lg px-3 py-3 text-base font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)]"
									onClick={() => setOpen(false)}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			) : null}
		</header>
	)
}

function MenuIcon () {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
		</svg>
	)
}

function CloseIcon () {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
		</svg>
	)
}
