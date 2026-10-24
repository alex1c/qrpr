/**
 * Form controls with consistent labels and error messaging.
 */
import { cn } from '@/lib/utils/cn'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Field ({
	label,
	htmlFor,
	hint,
	error,
	children,
}: {
	label: string
	htmlFor: string
	hint?: string
	error?: string | null
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={htmlFor} className="text-sm font-medium text-[var(--ink)]">
				{label}
			</label>
			{children}
			{hint && !error ? (
				<p className="text-xs text-[var(--ink-muted)]">{hint}</p>
			) : null}
			{error ? (
				<p className="text-xs text-red-600 dark:text-red-400" role="alert">
					{error}
				</p>
			) : null}
		</div>
	)
}

export function Input ({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={cn(
				'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5',
				'text-[var(--ink)] placeholder:text-[var(--ink-faint)]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-transparent',
				'disabled:opacity-50 min-h-[44px]',
				className,
			)}
			{...props}
		/>
	)
}

export function Textarea ({
	className,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			className={cn(
				'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5',
				'text-[var(--ink)] placeholder:text-[var(--ink-faint)]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-transparent',
				'disabled:opacity-50 min-h-[96px] resize-y',
				className,
			)}
			{...props}
		/>
	)
}

export function Select ({
	className,
	children,
	...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			className={cn(
				'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5',
				'text-[var(--ink)] min-h-[44px]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
				className,
			)}
			{...props}
		>
			{children}
		</select>
	)
}
