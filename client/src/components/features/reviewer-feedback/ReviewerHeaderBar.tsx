import { CalendarClock, ShieldCheck, UserRound } from 'lucide-react'

import type { ReviewAssignment } from '@/types/reviewerFeedback'
import { Badge } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { getDaysRemaining } from './reviewerFeedbackRules'

const DEADLINE_FORMATTER = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const URGENT_DAYS = 3

interface ReviewerHeaderBarProps {
  assignment: ReviewAssignment
  now?: Date
}

export function ReviewerHeaderBar({ assignment, now = new Date() }: ReviewerHeaderBarProps) {
  const daysRemaining = getDaysRemaining(assignment.deadlineIso, now)

  return (
    <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span className="font-semibold text-brand-700">{assignment.journalName}</span>
          <span aria-hidden>·</span>
          <span>{assignment.manuscriptId}</span>
          <span aria-hidden>·</span>
          <span>Peer review invitation</span>
        </div>
        <h1 className="text-xl leading-snug font-semibold text-heading sm:text-2xl">{assignment.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-body">
          <UserRound size={15} aria-hidden className="text-brand-600" />
          You are reviewing as <span className="font-semibold text-heading">{assignment.reviewerPseudonym}</span>
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 lg:items-end">
        {assignment.isDoubleBlind && (
          <Badge variant="brand">
            <ShieldCheck size={13} aria-hidden />
            Double-blind: identities shielded both ways
          </Badge>
        )}
        <Badge variant={daysRemaining <= URGENT_DAYS ? 'danger' : 'neutral'}>
          <CalendarClock size={13} aria-hidden />
          Due {DEADLINE_FORMATTER.format(new Date(assignment.deadlineIso))} ({daysRemaining} days remaining)
        </Badge>
      </div>
    </Card>
  )
}
