import { CircleCheck, RotateCcw } from 'lucide-react'

import { formatClock } from '@/lib/formatTime'
import type { PitchVideo } from '@/types/authorStudio'
import { Button } from '@/ui/Button'

interface RecordedPitchPlaybackProps {
  pitchVideo: PitchVideo
  isLocked: boolean
  onRetake: () => void
}

export function RecordedPitchPlayback({ pitchVideo, isLocked, onRetake }: RecordedPitchPlaybackProps) {
  return (
    <div className="flex flex-col gap-3">
      <video
        src={pitchVideo.url}
        controls
        playsInline
        aria-label="Your recorded pitch"
        className="aspect-video w-full rounded-lg bg-gray-900"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm text-green-700">
          <CircleCheck size={16} aria-hidden />
          Pitch recorded · {formatClock(pitchVideo.durationSeconds)}
        </p>
        <Button variant="secondary" onClick={onRetake} disabled={isLocked}>
          <RotateCcw aria-hidden />
          Retake
        </Button>
      </div>
    </div>
  )
}
