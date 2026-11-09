import { Pause, Play } from 'lucide-react'
import { useId, type ReactNode } from 'react'

import { formatClock } from '@/lib/formatTime'
import { Button } from '@/ui/Button'

export interface PlaybackMarker {
  seconds: number
  label: string
}

interface PlaybackBarProps {
  isPlaying: boolean
  currentSeconds: number
  durationSeconds: number
  markers?: readonly PlaybackMarker[]
  isDisabled?: boolean
  onTogglePlay: () => void
  onSeek: (seconds: number) => void
  children?: ReactNode
}

export function PlaybackBar({
  isPlaying,
  currentSeconds,
  durationSeconds,
  markers = [],
  isDisabled = false,
  onTogglePlay,
  onSeek,
  children,
}: PlaybackBarProps) {
  const seekId = useId()
  const safeDuration = Math.max(durationSeconds, 1)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={onTogglePlay}
        disabled={isDisabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}
      </Button>
      <div className="relative flex min-w-40 flex-1 items-center">
        <label htmlFor={seekId} className="sr-only">
          Seek
        </label>
        <input
          id={seekId}
          type="range"
          min={0}
          max={safeDuration}
          step={0.1}
          value={Math.min(currentSeconds, safeDuration)}
          disabled={isDisabled}
          aria-valuetext={`${formatClock(currentSeconds)} of ${formatClock(safeDuration)}`}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="w-full accent-brand-600 disabled:opacity-50"
        />
        {markers.map((marker) => (
          <span
            key={marker.seconds}
            aria-hidden
            title={marker.label}
            className="pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-brand-300"
            style={{ left: `${(marker.seconds / safeDuration) * 100}%` }}
          />
        ))}
      </div>
      <span className="font-mono text-[13px] text-muted tabular-nums">
        {formatClock(currentSeconds)} / {formatClock(safeDuration)}
      </span>
      {children}
    </div>
  )
}
