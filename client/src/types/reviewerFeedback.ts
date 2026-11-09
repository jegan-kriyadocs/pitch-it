import type { PitchSlide, TranscriptSegment } from './pitch'

export type RubricCriterionId =
  | 'methodologicalRigor'
  | 'scientificOriginality'
  | 'statisticalProof'
  | 'clinicalSignificance'

export interface RubricCriterion {
  id: RubricCriterionId
  label: string
  description: string
  weight: number
}

export type RubricScores = Record<RubricCriterionId, number>

export type Recommendation = 'accept' | 'minor_revision' | 'major_revision' | 'reject_transfer'

export type FeedbackMode = 'video_audio' | 'audio_only'

export type CritiqueField = 'commentsToAuthor' | 'confidentialCommentsToEditor'

export type CritiqueText = Record<CritiqueField, string>

export type ReviewSubmissionStatus = 'drafting' | 'submitting' | 'submitted'

export interface TimestampAnnotation {
  id: string
  seconds: number
  slideIndex: number
  text: string
}

export interface BlindedPitch {
  title: string
  durationSeconds: number
  slides: PitchSlide[]
  transcript: TranscriptSegment[]
}

export interface ReviewAssignment {
  invitationToken: string
  manuscriptId: string
  journalName: string
  title: string
  reviewerPseudonym: string
  reviewerOrcid: string
  deadlineIso: string
  isDoubleBlind: boolean
  pitch: BlindedPitch
}

export interface FeedbackMedia {
  url: string
  blob: Blob
  durationSeconds: number
  mode: FeedbackMode
}

export interface TonePhrase {
  phrase: string
  suggestion: string
}

export interface ToneFinding {
  field: CritiqueField
  phrase: string
  suggestion: string
}

export interface ToneAnalysis {
  warmthScore: number
  actionabilityScore: number
  findings: ToneFinding[]
}
