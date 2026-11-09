import { Captions, LoaderCircle, PictureInPicture2, VideoOff } from 'lucide-react'
import { useRef, useState } from 'react'

import { usePictureInPicture } from '@/hooks/usePictureInPicture'
import type { SimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import { cn } from '@/lib/cn'
import { formatClock } from '@/lib/formatTime'
import type { TriageSubmission } from '@/types/editorTriage'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { EmptyState } from '@/ui/EmptyState'
import { PlaybackBar } from '@/ui/PlaybackBar'
import { ProgressBar } from '@/ui/ProgressBar'
import { SelectField } from '@/ui/SelectField'
import { PLAYBACK_RATES } from './editorTriageData'
import { PresenterCanvas } from './PresenterCanvas'

const RATE_OPTIONS = PLAYBACK_RATES.map((rate) => ({ value: String(rate), label: `${rate}×` }))

interface SynchronizedPlayerProps {
  submission: TriageSubmission
  playback: SimulatedPlayback
  caption: string
  activeSlideIndex: number
}

function PendingPitch({ submission }: { submission: TriageSubmission }) {
  const { pitch } = submission
  if (pitch.status === 'processing') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <EmptyState
          icon={LoaderCircle}
          title="Pitch video is processing"
          description="Cadmore is transcoding the video and generating captions. You can still review the author's identity below."
        />
        <ProgressBar label="Processing progress" value={pitch.processingPercent ?? 0} className="w-full max-w-sm" />
        <span className="text-[13px] text-muted">{pitch.processingPercent ?? 0}% complete</span>
      </div>
    )
  }
  return (
    <EmptyState
      icon={VideoOff}
      title="No pitch video"
      description="The author submitted without a video pitch. Triage from the manuscript instead."
      className="py-10"
    />
  )
}

export function SynchronizedPlayer({ submission, playback, caption, activeSlideIndex }: SynchronizedPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [areCaptionsVisible, setAreCaptionsVisible] = useState(true)
  const pictureInPicture = usePictureInPicture(canvasRef)
  const { pitch } = submission

  if (pitch.status !== 'ready') {
    return (
      <Card className="p-5">
        <PendingPitch submission={submission} />
      </Card>
    )
  }

  const markers = pitch.slides.map((slide) => ({ seconds: slide.startSeconds, label: slide.title }))

  return (
    <Card className="flex flex-col gap-3 p-4">
      <PresenterCanvas
        canvasRef={canvasRef}
        label={pitch.isAnonymized ? 'Anonymized presenter' : submission.author.displayName}
        caption={caption}
        isAnonymized={pitch.isAnonymized}
        isPlaying={playback.isPlaying}
        areCaptionsVisible={areCaptionsVisible}
      />
      <PlaybackBar
        isPlaying={playback.isPlaying}
        currentSeconds={playback.currentSeconds}
        durationSeconds={pitch.durationSeconds}
        markers={markers}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seek}
      >
        <SelectField
          label="Speed"
          options={RATE_OPTIONS}
          value={String(playback.playbackRate)}
          onChange={(event) => playback.setPlaybackRate(Number(event.target.value))}
        />
        <Button
          variant={areCaptionsVisible ? 'secondary' : 'ghost'}
          size="sm"
          aria-pressed={areCaptionsVisible}
          aria-label="Captions"
          onClick={() => setAreCaptionsVisible(!areCaptionsVisible)}
        >
          <Captions aria-hidden />
        </Button>
        {pictureInPicture.isSupported && (
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={pictureInPicture.isActive}
            aria-label="Picture in picture"
            onClick={() => void pictureInPicture.toggle()}
          >
            <PictureInPicture2 aria-hidden />
          </Button>
        )}
      </PlaybackBar>
      <nav aria-label="Chapters" className="flex flex-wrap gap-2">
        {pitch.slides.map((slide, index) => (
          <button
            key={slide.startSeconds}
            type="button"
            aria-current={index === activeSlideIndex ? 'step' : undefined}
            onClick={() => playback.seek(slide.startSeconds)}
            className={cn(
              'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-brand-600',
              index === activeSlideIndex
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-border bg-white text-body hover:bg-gray-50',
            )}
          >
            {formatClock(slide.startSeconds)} · {slide.title}
          </button>
        ))}
      </nav>
    </Card>
  )
}
