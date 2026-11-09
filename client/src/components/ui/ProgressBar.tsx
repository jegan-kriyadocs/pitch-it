import { cn } from '@/lib/cn'

type ProgressTone = 'brand' | 'success' | 'warning' | 'danger'

interface ProgressBarProps {
  label: string
  value: number
  max?: number
  tone?: ProgressTone
  valueText?: string
  className?: string
}

const TONE_CLASSES: Record<ProgressTone, string> = {
  brand: 'bg-brand-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-600',
}

export function ProgressBar({
  label,
  value,
  max = 100,
  tone = 'brand',
  valueText,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={valueText}
      className={cn('h-2 overflow-hidden rounded-full bg-gray-100', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', TONE_CLASSES[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
