/**
 * Accessible button with variants for primary actions and quiet controls.
 */
import { cn } from '@/lib/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant
	size?: Size
}

const variants: Record<Variant, string> = {
	primary:
		'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]',
	secondary:
		'bg-[var(--surface-elevated)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--surface-muted)]',
	ghost:
		'bg-transparent text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]',
	danger:
		'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
}

const sizes: Record<Size, string> = {
	sm: 'h-9 px-3 text-sm gap-1.5',
	md: 'h-11 px-4 text-sm gap-2',
	lg: 'h-12 px-5 text-base gap-2',
}

export function Button ({
	className,
	variant = 'primary',
	size = 'md',
	type = 'button',
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={cn(
				'inline-flex items-center justify-center rounded-xl font-medium transition-colors',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
				'disabled:pointer-events-none disabled:opacity-50',
				'min-h-[44px] touch-manipulation',
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
