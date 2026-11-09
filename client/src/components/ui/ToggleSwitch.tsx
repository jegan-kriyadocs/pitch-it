import { useId, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface ToggleSwitchProps {
  label: string
  description?: ReactNode
  isChecked: boolean
  isDisabled?: boolean
  onChange: (isChecked: boolean) => void
}

export function ToggleSwitch({
  label,
  description,
  isChecked,
  isDisabled = false,
  onChange,
}: ToggleSwitchProps) {
  const labelId = useId()
  const descriptionId = useId()

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span id={labelId} className="text-sm font-semibold text-heading">
          {label}
        </span>
        {description && (
          <span id={descriptionId} className="text-[13px] text-body">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        disabled={isDisabled}
        onClick={() => onChange(!isChecked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50',
          isChecked ? 'bg-brand-600' : 'bg-gray-300',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'inline-block size-5 rounded-full bg-white shadow transition-transform',
            isChecked ? 'translate-x-5.5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
