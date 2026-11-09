import { Mic } from 'lucide-react'

import { cn } from '@/lib/cn'

const METER_BARS = 12
const CLIPPING_BAR_INDEX = 9

interface AudioLevelMeterProps {
  level: number
  label?: string
}

export function AudioLevelMeter({ level, label = 'Microphone level' }: AudioLevelMeterProps) {
  const litBars = Math.round(level * METER_BARS)

  return (
    <div className="flex items-center gap-2 text-muted">
      <Mic size={14} aria-hidden />
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(level * 100)}
        className="flex h-4 items-end gap-0.5"
      >
        {Array.from({ length: METER_BARS }, (_, index) => (
          <span
            key={index}
            className={cn(
              'w-1.5 rounded-sm',
              index < litBars ? (index > CLIPPING_BAR_INDEX ? 'bg-red-500' : 'bg-emerald-500') : 'bg-gray-200',
            )}
            style={{ height: `${40 + (index / METER_BARS) * 60}%` }}
          />
        ))}
      </div>
    </div>
  )
}
