export type PitchStatus = 'ready' | 'processing' | 'no_pitch'

export type KycStatus = 'verified' | 'single_author_warning' | 'flagged'

export type RiskLevel = 'low' | 'medium' | 'high'

export type TriageDecision = 'pending' | 'accepted_for_review' | 'repitch_requested' | 'desk_rejected'

export type DecisionAction = Exclude<TriageDecision, 'pending'>

export type ReviewerVideoAccess = 'anonymized_stream_only' | 'full_video' | 'no_video'

export type IntegrityCheckStatus = 'pass' | 'warn' | 'fail'

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

export interface PitchMedia {
  pitchId: string
  status: PitchStatus
  durationSeconds: number
  isAnonymized: boolean
  processingPercent?: number
  slides: PitchSlide[]
  transcript: TranscriptSegment[]
  summary: SummaryPoint[]
}

export interface IntegrityCheck {
  label: string
  status: IntegrityCheckStatus
  detail: string
}

export interface AuthorProfile {
  displayName: string
  orcid: string
  affiliation: string
  publicationCount: number
  hIndex: number
  coAuthorCount: number
}

export interface SuggestedReviewer {
  id: string
  name: string
  expertise: string
  matchPercent: number
  isAvailable: boolean
}

export interface DecisionRecord {
  decision: DecisionAction
  notes: string
  reviewerVideoAccess?: ReviewerVideoAccess
  rejectReasons?: string[]
  decidedAt: string
}

export interface TriageSubmission {
  manuscriptId: string
  journalName: string
  title: string
  articleType: string
  submittedAt: string
  tags: string[]
  noveltyScore: number
  riskScore: number
  riskLevel: RiskLevel
  kycStatus: KycStatus
  author: AuthorProfile
  integrityChecks: IntegrityCheck[]
  pitch: PitchMedia
  reviewers: SuggestedReviewer[]
  decision: TriageDecision
  decisionRecord?: DecisionRecord
  invitedReviewerIds: string[]
}
