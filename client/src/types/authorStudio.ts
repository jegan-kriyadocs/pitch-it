export type StudioMode = 'live_record' | 'upload_video'

export type RecordingState =
  | 'idle'
  | 'preflight'
  | 'countdown'
  | 'recording'
  | 'paused'
  | 'reviewing'
  | 'uploading'
  | 'success'

export type ReviewPolicy = 'double_blind' | 'single_blind'

export type TemplateId = 'clinical_trial' | 'basic_science' | 'systematic_review' | 'case_study'

export interface SlideItem {
  pageNumber: number
  title: string
  points: string[]
  notes: string[]
  script: string
  thumbnailUrl?: string
}

export interface PitchTemplate {
  id: TemplateId
  label: string
  slides: SlideItem[]
}

export interface AnonymizationConfig {
  visualMaskEnabled: boolean
  voiceModulationEnabled: boolean
  journalPolicyEnforced: boolean
}

export interface ManuscriptSession {
  manuscriptId: string
  journalName: string
  shortTitle: string
  doiPreview: string
  reviewPolicy: ReviewPolicy
  targetDurationSeconds: number
  maxDurationSeconds: number
}

export interface PitchVideo {
  blob: Blob
  url: string
  durationSeconds: number
  source: StudioMode
  fileName?: string
}
