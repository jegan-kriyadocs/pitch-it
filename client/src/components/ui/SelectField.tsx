import { useId, type ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<ComponentProps<'select'>, 'children'> {
  label: string
  options: readonly SelectOption[]
}

export function SelectField({ label, options, id, className, ...selectProps }: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div
      className={cn(
        'inline-flex h-[38px] min-w-0 items-center gap-0.5 rounded-base border border-border bg-white pr-1 pl-3 focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-100',
        className,
      )}
    >
      <label htmlFor={selectId} className="cursor-pointer text-[13px] whitespace-nowrap text-muted">
        {label}
      </label>
      <select
        id={selectId}
        className="h-9 min-w-0 flex-1 cursor-pointer truncate bg-transparent px-1.5 text-sm font-medium text-heading outline-hidden disabled:cursor-not-allowed disabled:opacity-60"
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
