/**
 * QR-PR wordmark with custom SVG mark (finder-pattern inspired).
 */
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function LogoMark ({ className }: { className?: string }) {
	return (
		<svg
			className={cn('shrink-0', className)}
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect width="32" height="32" rx="8" fill="var(--accent)" />
			{/* Top-left finder */}
			<rect x="5" y="5" width="9" height="9" rx="1.5" fill="white" />
			<rect x="7" y="7" width="5" height="5" rx="0.75" fill="var(--accent)" />
			{/* Top-right finder */}
			<rect x="18" y="5" width="9" height="9" rx="1.5" fill="white" />
			<rect x="20" y="7" width="5" height="5" rx="0.75" fill="var(--accent)" />
			{/* Bottom-left finder */}
			<rect x="5" y="18" width="9" height="9" rx="1.5" fill="white" />
			<rect x="7" y="20" width="5" height="5" rx="0.75" fill="var(--accent)" />
			{/* Data modules */}
			<rect x="18" y="18" width="3" height="3" rx="0.5" fill="white" />
			<rect x="22" y="18" width="3" height="3" rx="0.5" fill="white" />
			<rect x="26" y="18" width="1" height="3" rx="0.3" fill="white" />
			<rect x="18" y="22" width="3" height="3" rx="0.5" fill="white" />
			<rect x="24" y="22" width="3" height="3" rx="0.5" fill="white" />
			<rect x="18" y="26" width="9" height="1" rx="0.3" fill="white" />
		</svg>
	)
}

export function Logo ({
	className,
	priority = false,
}: {
	className?: string
	priority?: boolean
}) {
	return (
		<Link
			href="/"
			className={cn(
				'inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
				className,
			)}
			aria-label="QR-PR — на главную"
		>
			<LogoMark className={priority ? 'h-9 w-9' : 'h-8 w-8'} />
			<span
				className={cn(
					'font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--ink)]',
					priority ? 'text-2xl' : 'text-lg',
				)}
			>
				QR-PR
			</span>
		</Link>
	)
}
