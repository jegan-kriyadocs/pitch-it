import { useId } from 'react'

interface RatingSliderProps {
  label: string
  description?: string
  value: number
  min?: number
  max?: number
  valueLabel: string
  onChange: (value: number) => void
}

export function RatingSlider({
  label,
  description,
  value,
  min = 1,
  max = 5,
  valueLabel,
  onChange,
}: RatingSliderProps) {
  const sliderId = useId()
  const descriptionId = useId()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <label htmlFor={sliderId} className="text-sm font-semibold text-heading">
            {label}
          </label>
          {description && (
            <p id={descriptionId} className="text-[13px] text-body">
              {description}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-base bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-700 tabular-nums">
          {value} / {max}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-valuetext={`${value} of ${max}, ${valueLabel}`}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-[11px] text-muted" aria-hidden>
        <span>{min} · Weak</span>
        <span className="font-medium text-heading-secondary">{valueLabel}</span>
        <span>{max} · Excellent</span>
      </div>
    </div>
  )
}
