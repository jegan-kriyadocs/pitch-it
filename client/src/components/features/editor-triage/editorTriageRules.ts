import { formatDurationLabel } from '@/lib/formatTime'
import type {
  KycStatus,
  PitchMedia,
  RiskLevel,
  TriageDecision,
  TriageSubmission,
} from '@/types/editorTriage'
import type { BadgeVariant } from '@/ui/Badge'

export type QueueFilter = 'all' | 'pending' | 'flagged' | 'decided'

interface BadgeDescriptor {
  label: string
  variant: BadgeVariant
}

const KYC_BADGES: Record<KycStatus, BadgeDescriptor> = {
  verified: { label: 'Author verified via video', variant: 'success' },
  single_author_warning: { label: 'Single-author warning', variant: 'warning' },
  flagged: { label: 'Anomaly: further KYC required', variant: 'danger' },
}

const RISK_BADGES: Record<RiskLevel, BadgeDescriptor> = {
  low: { label: 'Paper mill risk: low', variant: 'success' },
  medium: { label: 'Paper mill risk: medium', variant: 'warning' },
  high: { label: 'Paper mill risk: high', variant: 'danger' },
}

const DECISION_BADGES: Record<TriageDecision, BadgeDescriptor> = {
  pending: { label: 'Awaiting triage', variant: 'neutral' },
  accepted_for_review: { label: 'Accepted for review', variant: 'success' },
  repitch_requested: { label: 'Re-pitch requested', variant: 'warning' },
  desk_rejected: { label: 'Desk rejected', variant: 'danger' },
}

export const getKycBadge = (status: KycStatus) => KYC_BADGES[status]
export const getRiskBadge = (level: RiskLevel) => RISK_BADGES[level]
export const getDecisionBadge = (decision: TriageDecision) => DECISION_BADGES[decision]

export function getPitchBadge(pitch: PitchMedia): BadgeDescriptor {
  if (pitch.status === 'ready') {
    return { label: `Ready ${formatDurationLabel(pitch.durationSeconds)}`, variant: 'info' }
  }
  if (pitch.status === 'processing') {
    return { label: 'Processing', variant: 'warning' }
  }
  return { label: 'No pitch', variant: 'neutral' }
}

export function needsAttention(submission: TriageSubmission) {
  return submission.kycStatus !== 'verified' || submission.riskLevel !== 'low'
}

export function matchesFilter(submission: TriageSubmission, filter: QueueFilter) {
  if (filter === 'pending') {
    return submission.decision === 'pending'
  }
  if (filter === 'flagged') {
    return needsAttention(submission)
  }
  if (filter === 'decided') {
    return submission.decision !== 'pending'
  }
  return true
}

export function matchesSearch(submission: TriageSubmission, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }
  return [submission.manuscriptId, submission.title, submission.articleType, ...submission.tags]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery)
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function formatSubmittedDate(isoDate: string) {
  return DATE_FORMATTER.format(new Date(isoDate))
}
