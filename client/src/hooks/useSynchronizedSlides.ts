import { findActiveIndex } from '@/features/editor-triage/editorTriageRules'
import type { PitchMedia } from '@/types/editorTriage'

export function useSynchronizedSlides(pitch: PitchMedia, currentSeconds: number) {
  const activeSlideIndex = Math.max(0, findActiveIndex(pitch.slides, currentSeconds))
  const activeSegmentIndex = findActiveIndex(pitch.transcript, currentSeconds)

  return {
    activeSlideIndex,
    activeSlide: pitch.slides[activeSlideIndex] ?? null,
    activeSegmentIndex,
    activeCaption: pitch.transcript[activeSegmentIndex]?.text ?? '',
  }
}
