import { Captions, PictureInPicture2 } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

import { usePictureInPicture } from '@/hooks/usePictureInPicture'
import type { SimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import type { PitchSlide } from '@/types/pitch'
import { Button } from '@/ui/Button'
import { ChapterNav } from '@/ui/ChapterNav'
import { PlaybackBar } from '@/ui/PlaybackBar'
import { PlaybackRateSelect } from '@/ui/PlaybackRateSelect'
import { PresenterCanvas } from '@/ui/PresenterCanvas'

interface SimulatedPitchPlayerProps {
  presenterLabel: string
  isAnonymized: boolean
  durationSeconds: number
  slides: PitchSlide[]
  playback: SimulatedPlayback
  caption: string
  activeSlideIndex: number
  overlay?: ReactNode
  extraControls?: ReactNode
}

export function SimulatedPitchPlayer({
  presenterLabel,
  isAnonymized,
  durationSeconds,
  slides,
  playback,
  caption,
  activeSlideIndex,
  overlay,
  extraControls,
}: SimulatedPitchPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [areCaptionsVisible, setAreCaptionsVisible] = useState(true)
  const pictureInPicture = usePictureInPicture(canvasRef)
  const markers = slides.map((slide) => ({ seconds: slide.startSeconds, label: slide.title }))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <PresenterCanvas
          canvasRef={canvasRef}
          label={presenterLabel}
          caption={caption}
          isAnonymized={isAnonymized}
          isPlaying={playback.isPlaying}
          areCaptionsVisible={areCaptionsVisible}
        />
        {overlay}
      </div>
      <PlaybackBar
        isPlaying={playback.isPlaying}
        currentSeconds={playback.currentSeconds}
        durationSeconds={durationSeconds}
        markers={markers}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seek}
      >
        <PlaybackRateSelect value={playback.playbackRate} onChange={playback.setPlaybackRate} />
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
        {extraControls}
      </PlaybackBar>
      <ChapterNav chapters={slides} activeIndex={activeSlideIndex} onSeek={playback.seek} />
    </div>
  )
}
