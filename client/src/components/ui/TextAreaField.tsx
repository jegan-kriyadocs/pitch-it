import { useId, type ComponentProps } from 'react'

import { cn } from '@/lib/cn'

interface TextAreaFieldProps extends ComponentProps<'textarea'> {
  label: string
  hint?: string
  errorMessage?: string | null
}

export function TextAreaField({
  label,
  hint,
  errorMessage,
  id,
  className,
  rows = 4,
  ...textAreaProps
}: TextAreaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = [hint ? hintId : null, errorMessage ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-sm font-semibold text-heading">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-[13px] text-body">
          {hint}
        </p>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={describedBy || undefined}
        className={cn(
          'w-full resize-y rounded-base border bg-white px-3 py-2 text-sm text-heading outline-hidden placeholder:text-muted focus:ring-3',
          errorMessage
            ? 'border-red-500 focus:ring-red-100'
            : 'border-border focus:border-brand-500 focus:ring-brand-100',
        )}
        {...textAreaProps}
      />
      {errorMessage && (
        <p id={errorId} role="alert" className="text-[13px] text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
