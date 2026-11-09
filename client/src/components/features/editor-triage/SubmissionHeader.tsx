import type { TriageSubmission } from '@/types/editorTriage'
import { Badge } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { formatSubmittedDate, getDecisionBadge } from './editorTriageRules'

interface SubmissionHeaderProps {
  submission: TriageSubmission
}

export function SubmissionHeader({ submission }: SubmissionHeaderProps) {
  const decisionBadge = getDecisionBadge(submission.decision)

  return (
    <Card className="flex flex-col gap-2 p-5">
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <span className="font-semibold text-brand-700">{submission.journalName}</span>
        <span aria-hidden>·</span>
        <span>{submission.manuscriptId}</span>
        <span aria-hidden>·</span>
        <span>{submission.articleType}</span>
        <span aria-hidden>·</span>
        <span>Submitted {formatSubmittedDate(submission.submittedAt)}</span>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 flex-1 text-xl leading-snug font-semibold text-heading sm:text-2xl">
          {submission.title}
        </h1>
        <Badge variant={decisionBadge.variant}>{decisionBadge.label}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="text-muted">Novelty score</span>
        <span className="font-semibold text-heading">{submission.noveltyScore} / 100</span>
        {submission.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-px text-xs text-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  )
}
