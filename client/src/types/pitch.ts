export interface PitchSlide {
  title: string
  points: string[]
  startSeconds: number
}

export interface TranscriptSegment {
  startSeconds: number
  endSeconds: number
  text: string
}

export interface SummaryPoint {
  label: string
  startSeconds: number
}

export interface PitchTimeline {
  slides: PitchSlide[]
  transcript: TranscriptSegment[]
}
