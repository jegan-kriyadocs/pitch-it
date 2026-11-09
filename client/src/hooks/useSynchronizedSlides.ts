import { findActiveIndex } from '@/lib/timeline'
import type { PitchTimeline } from '@/types/pitch'

export function useSynchronizedSlides(timeline: PitchTimeline, currentSeconds: number) {
  const activeSlideIndex = Math.max(0, findActiveIndex(timeline.slides, currentSeconds))
  const activeSegmentIndex = findActiveIndex(timeline.transcript, currentSeconds)

  return {
    activeSlideIndex,
    activeSlide: timeline.slides[activeSlideIndex] ?? null,
    activeSegmentIndex,
    activeCaption: timeline.transcript[activeSegmentIndex]?.text ?? '',
  }
}
