import { Circle, Mic, Pause, Play, RotateCcw, Square } from 'lucide-react'

import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'
import type { RecorderStatus } from '@/hooks/useMediaRecorder'
import { Button } from '@/ui/Button'

interface RecordingControlsProps {
  recorderStatus: RecorderStatus
  isCountingDown: boolean
  isReady: boolean
  elapsedSeconds: number
  maxSeconds: number
  warningSeconds: number
  audioLevel: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRetake: () => void
}

const METER_BARS = 12

export function RecordingControls({
  recorderStatus,
  isCountingDown,
  isReady,
  elapsedSeconds,
  maxSeconds,
  warningSeconds,
  audioLevel,
  onStart,
  onPause,
  onResume,
  onStop,
  onRetake,
}: RecordingControlsProps) {
  const isActive = recorderStatus !== 'inactive'
  const isNearLimit = elapsedSeconds >= warningSeconds
  const litBars = Math.round(audioLevel * METER_BARS)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {isActive ? (
          <Button variant="danger" onClick={onStop}>
            <Square aria-hidden />
            Stop recording
          </Button>
        ) : (
          <Button variant="danger" onClick={onStart} disabled={!isReady || isCountingDown}>
            <Circle aria-hidden className="fill-current" />
            {isCountingDown ? 'Get ready…' : 'Start recording'}
          </Button>
        )}
        {recorderStatus === 'paused' ? (
          <Button variant="secondary" onClick={onResume}>
            <Play aria-hidden />
            Resume
          </Button>
        ) : (
          <Button variant="secondary" onClick={onPause} disabled={recorderStatus !== 'recording'}>
            <Pause aria-hidden />
            Pause
          </Button>
        )}
        <Button variant="ghost" onClick={onRetake} disabled={!isActive}>
          <RotateCcw aria-hidden />
          Retake
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <p
          role="timer"
          aria-label={`Elapsed ${formatClock(elapsedSeconds)} of ${formatClock(maxSeconds)}`}
          className={cn(
            'rounded-base px-2.5 py-1 font-mono font-semibold tabular-nums',
            isNearLimit ? 'bg-amber-100 text-amber-800 motion-safe:animate-pulse' : 'bg-gray-100 text-heading',
          )}
        >
          {formatClock(elapsedSeconds)} / {formatClock(maxSeconds)}
        </p>
        <div className="flex items-center gap-2 text-muted">
          <Mic size={14} aria-hidden />
          <span className="sr-only">Microphone level</span>
          <div
            role="meter"
            aria-label="Microphone level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(audioLevel * 100)}
            className="flex h-4 items-end gap-0.5"
          >
            {Array.from({ length: METER_BARS }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'w-1.5 rounded-sm',
                  index < litBars ? (index > 9 ? 'bg-red-500' : 'bg-emerald-500') : 'bg-gray-200',
                )}
                style={{ height: `${40 + (index / METER_BARS) * 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      {isNearLimit && isActive && (
        <p role="status" className="text-[13px] text-amber-800">
          Recording stops automatically at {formatClock(maxSeconds)}.
        </p>
      )}
    </div>
  )
}
