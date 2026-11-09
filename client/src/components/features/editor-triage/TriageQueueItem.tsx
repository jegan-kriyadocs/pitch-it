import { ShieldAlert, ShieldCheck, Video } from 'lucide-react'

import { cn } from '@/lib/cn'
import type { TriageSubmission } from '@/types/editorTriage'
import { Badge } from '@/ui/Badge'
import {
  formatSubmittedDate,
  getDecisionBadge,
  getKycBadge,
  getPitchBadge,
  getRiskBadge,
} from './editorTriageRules'

interface TriageQueueItemProps {
  submission: TriageSubmission
  isSelected: boolean
  onSelect: (manuscriptId: string) => void
}

export function TriageQueueItem({ submission, isSelected, onSelect }: TriageQueueItemProps) {
  const pitchBadge = getPitchBadge(submission.pitch)
  const kycBadge = getKycBadge(submission.kycStatus)
  const riskBadge = getRiskBadge(submission.riskLevel)
  const decisionBadge = getDecisionBadge(submission.decision)
  const KycIcon = submission.kycStatus === 'verified' ? ShieldCheck : ShieldAlert

  return (
    <button
      type="button"
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => onSelect(submission.manuscriptId)}
      className={cn(
        'flex w-full cursor-pointer flex-col gap-2 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-600',
        isSelected ? 'border-brand-500 bg-brand-50' : 'border-border bg-white hover:bg-gray-50',
      )}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="font-semibold text-brand-700">{submission.manuscriptId}</span>
        <span>{formatSubmittedDate(submission.submittedAt)}</span>
      </div>
      <span className="line-clamp-2 text-sm font-semibold text-heading">{submission.title}</span>
      <div className="flex flex-wrap gap-1.5">
        <Badge size="xs" variant={pitchBadge.variant}>
          <Video size={11} aria-hidden />
          {pitchBadge.label}
        </Badge>
        <Badge size="xs" variant={kycBadge.variant}>
          <KycIcon size={11} aria-hidden />
          {kycBadge.label}
        </Badge>
        <Badge size="xs" variant={riskBadge.variant}>
          {riskBadge.label}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {submission.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-px text-[11px] text-gray-700">
            {tag}
          </span>
        ))}
        {submission.decision !== 'pending' && (
          <Badge size="xs" variant={decisionBadge.variant} className="ml-auto">
            {decisionBadge.label}
          </Badge>
        )}
      </div>
    </button>
  )
}
