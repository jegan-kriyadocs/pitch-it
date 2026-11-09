import { Circle, Pause, Play, RotateCcw, Square } from 'lucide-react'

import { formatClock } from '@/lib/formatTime'
import type { RecorderStatus } from '@/hooks/useMediaRecorder'
import { AudioLevelMeter } from '@/ui/AudioLevelMeter'
import { Button } from '@/ui/Button'
import { RecordingTimer } from '@/ui/RecordingTimer'

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <RecordingTimer elapsedSeconds={elapsedSeconds} maxSeconds={maxSeconds} warningSeconds={warningSeconds} />
        <AudioLevelMeter level={audioLevel} />
      </div>
      {isNearLimit && isActive && (
        <p role="status" className="text-[13px] text-amber-800">
          Recording stops automatically at {formatClock(maxSeconds)}.
        </p>
      )}
    </div>
  )
}
