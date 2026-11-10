import { CircleAlert, type LucideIcon } from 'lucide-react'
import { useId, type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface TextFieldProps extends ComponentProps<'input'> {
  label: string
  errorMessage?: string | null
  hint?: string
  leadingIcon?: LucideIcon
  endSlot?: ReactNode
}

export function TextField({
  label,
  errorMessage,
  hint,
  leadingIcon: LeadingIcon,
  endSlot,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const describedBy = [hint ? hintId : null, errorMessage ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-[13px] font-medium text-heading-secondary">
        {label}
      </label>
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            size={16}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-11 w-full rounded-base border bg-white px-3 text-sm text-heading outline-hidden placeholder:text-muted focus:ring-3',
            errorMessage ? 'border-red-500 focus:ring-red-100' : 'border-border focus:border-brand-500 focus:ring-brand-100',
            LeadingIcon && 'pl-9',
            endSlot && 'pr-11.5',
          )}
          {...inputProps}
        />
        {endSlot && <div className="absolute top-1 right-1">{endSlot}</div>}
      </div>
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {errorMessage && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs text-red-700">
          <CircleAlert size={14} aria-hidden className="shrink-0" />
          {errorMessage}
        </p>
      )}
    </div>
  )
}
