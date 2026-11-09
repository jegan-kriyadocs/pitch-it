import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'

interface RecordingTimerProps {
  elapsedSeconds: number
  maxSeconds: number
  warningSeconds: number
}

export function RecordingTimer({ elapsedSeconds, maxSeconds, warningSeconds }: RecordingTimerProps) {
  const isNearLimit = elapsedSeconds >= warningSeconds

  return (
    <p
      role="timer"
      aria-label={`Elapsed ${formatClock(elapsedSeconds)} of ${formatClock(maxSeconds)}`}
      className={cn(
        'rounded-base px-2.5 py-1 text-[13px] font-mono font-semibold tabular-nums',
        isNearLimit ? 'bg-amber-100 text-amber-800 motion-safe:animate-pulse' : 'bg-gray-100 text-heading',
      )}
    >
      {formatClock(elapsedSeconds)} / {formatClock(maxSeconds)}
    </p>
  )
}
