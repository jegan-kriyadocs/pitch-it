import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export interface SegmentOption<TValue extends string> {
  value: TValue
  label: string
  icon?: LucideIcon
}

interface SegmentedControlProps<TValue extends string> {
  label: string
  options: readonly SegmentOption<TValue>[]
  value: TValue | null
  isDisabled?: boolean
  onChange: (value: TValue) => void
}

export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  isDisabled = false,
  onChange,
}: SegmentedControlProps<TValue>) {
  return (
    <div role="group" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-gray-100 p-1">
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
        const isSelected = optionValue === value
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={isSelected}
            disabled={isDisabled}
            onClick={() => onChange(optionValue)}
            className={cn(
              'flex h-9 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-base px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60',
              isSelected ? 'bg-white text-brand-700 shadow-sm' : 'text-body hover:text-heading',
            )}
          >
            {Icon && <Icon size={15} aria-hidden className="shrink-0" />}
            <span className="truncate">{optionLabel}</span>
          </button>
        )
      })}
    </div>
  )
}
