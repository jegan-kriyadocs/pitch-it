import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface CheckboxFieldProps {
  label: string
  description?: ReactNode
  isChecked: boolean
  isDisabled?: boolean
  onChange: (isChecked: boolean) => void
  className?: string
}

export function CheckboxField({
  label,
  description,
  isChecked,
  isDisabled = false,
  onChange,
  className,
}: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-60',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-brand-600"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium text-heading">{label}</span>
        {description && <span className="text-[13px] text-body">{description}</span>}
      </span>
    </label>
  )
}
