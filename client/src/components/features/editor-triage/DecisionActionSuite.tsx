import { CircleCheck, MessageSquareReply, Undo2, XCircle } from 'lucide-react'

import { showToast } from '@/lib/toastStore'
import type { DecisionAction, TriageSubmission } from '@/types/editorTriage'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { getDecisionBadge } from './editorTriageRules'
import { useEditorTriageStore } from './editorTriageStore'
import { getVideoAccessLabel } from './ReviewerVisibilityPicker'

interface DecisionActionSuiteProps {
  submission: TriageSubmission
  onChooseAction: (action: DecisionAction) => void
}

export function DecisionActionSuite({ submission, onChooseAction }: DecisionActionSuiteProps) {
  const undoDecision = useEditorTriageStore((state) => state.undoDecision)
  const { decisionRecord } = submission
  const decisionBadge = getDecisionBadge(submission.decision)

  function undo() {
    undoDecision(submission.manuscriptId)
    showToast({ variant: 'info', title: 'Decision undone', description: `${submission.manuscriptId} is back in triage.` })
  }

  if (decisionRecord) {
    return (
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Badge variant={decisionBadge.variant} className="self-start">
            {decisionBadge.label}
          </Badge>
          {decisionRecord.reviewerVideoAccess && (
            <p className="text-[13px] text-body">Reviewers see: {getVideoAccessLabel(decisionRecord.reviewerVideoAccess)}</p>
          )}
          {decisionRecord.rejectReasons && (
            <p className="text-[13px] text-body">Reasons: {decisionRecord.rejectReasons.join('; ')}</p>
          )}
          {decisionRecord.notes && <p className="text-[13px] text-body">“{decisionRecord.notes}”</p>}
        </div>
        <Button variant="ghost" onClick={undo}>
          <Undo2 aria-hidden />
          Undo decision
        </Button>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-heading">Triage decision</h2>
        <p className="text-[13px] text-muted">Watch the pitch, check the author, then decide.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" onClick={() => onChooseAction('desk_rejected')} className="text-red-700 hover:bg-red-50">
          <XCircle aria-hidden />
          Desk reject
        </Button>
        <Button variant="secondary" onClick={() => onChooseAction('repitch_requested')}>
          <MessageSquareReply aria-hidden />
          Request re-pitch
        </Button>
        <Button onClick={() => onChooseAction('accepted_for_review')}>
          <CircleCheck aria-hidden />
          Accept for review
        </Button>
      </div>
    </Card>
  )
}
