import { useSimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import { useSynchronizedSlides } from '@/hooks/useSynchronizedSlides'
import type { BlindedPitch } from '@/types/reviewerFeedback'
import { AuthorPitchBlindedPlayer } from './AuthorPitchBlindedPlayer'
import { TimestampAnnotationList } from './TimestampAnnotationList'

interface ReviewerPitchPanelProps {
  pitch: BlindedPitch
}

export function ReviewerPitchPanel({ pitch }: ReviewerPitchPanelProps) {
  const playback = useSimulatedPlayback(pitch.durationSeconds)
  const sync = useSynchronizedSlides(pitch, playback.currentSeconds)

  return (
    <>
      <AuthorPitchBlindedPlayer
        pitch={pitch}
        playback={playback}
        caption={sync.activeCaption}
        activeSlideIndex={sync.activeSlideIndex}
      />
      <TimestampAnnotationList
        currentSeconds={playback.currentSeconds}
        activeSlideIndex={sync.activeSlideIndex}
        onPause={playback.pause}
        onSeek={playback.seek}
      />
    </>
  )
}
