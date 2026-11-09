import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'

import { cn } from '@/lib/cn'

export interface RadioCardOption<TValue extends string> {
  value: TValue
  label: string
  description: string
  icon?: LucideIcon
}

interface RadioCardGroupProps<TValue extends string> {
  legend: string
  options: readonly RadioCardOption<TValue>[]
  value: TValue | null
  onChange: (value: TValue) => void
}

export function RadioCardGroup<TValue extends string>({
  legend,
  options,
  value,
  onChange,
}: RadioCardGroupProps<TValue>) {
  const groupName = useId()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-semibold text-heading">{legend}</legend>
      {options.map(({ value: optionValue, label, description, icon: Icon }) => {
        const isSelected = optionValue === value
        return (
          <label
            key={optionValue}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-focus-visible:outline-2 has-focus-visible:outline-brand-600',
              isSelected ? 'border-brand-500 bg-brand-50' : 'border-border bg-white hover:bg-gray-50',
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={optionValue}
              checked={isSelected}
              onChange={() => onChange(optionValue)}
              className="mt-0.5 size-4 shrink-0 accent-brand-600"
            />
            {Icon && <Icon size={18} aria-hidden className="mt-px shrink-0 text-brand-600" />}
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-heading">{label}</span>
              <span className="text-[13px] text-body">{description}</span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
