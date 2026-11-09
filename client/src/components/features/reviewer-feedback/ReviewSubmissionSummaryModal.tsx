import { BadgeCheck, CircleCheck, Send } from 'lucide-react'

import type { ReviewerEvaluation } from '@/hooks/useReviewerEvaluation'
import { Alert } from '@/ui/Alert'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { REVIEW_ASSIGNMENT } from './reviewerFeedbackData'
import { ReviewSummaryDetails } from './ReviewSummaryDetails'

interface ReviewSubmissionSummaryModalProps {
  evaluation: ReviewerEvaluation
  onClose: () => void
}

function CreditBadge() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
      <BadgeCheck size={20} aria-hidden className="mt-px shrink-0 text-emerald-600" />
      <p className="text-[13px] text-emerald-700">
        <span className="font-semibold">Verified review credit</span> will sync to ORCID {REVIEW_ASSIGNMENT.reviewerOrcid} and
        your Web of Science reviewer profile. Your identity stays hidden from the authors.
      </p>
    </div>
  )
}

export function ReviewSubmissionSummaryModal({ evaluation, onClose }: ReviewSubmissionSummaryModalProps) {
  const { submissionStatus, canSubmit } = evaluation
  const isSubmitted = submissionStatus === 'submitted'
  const isSubmitting = submissionStatus === 'submitting'

  if (isSubmitted) {
    return (
      <Dialog title="Review submitted" onClose={onClose} footer={<Button onClick={onClose} data-autofocus>Done</Button>}>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 motion-safe:animate-pop-in">
            <CircleCheck size={34} aria-hidden className="text-emerald-600" />
          </span>
          <p className="text-sm text-body">
            Thank you. The editor of {REVIEW_ASSIGNMENT.journalName} has your review of {REVIEW_ASSIGNMENT.manuscriptId}.
          </p>
          <CreditBadge />
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog
      title="Review your submission"
      description={`${REVIEW_ASSIGNMENT.manuscriptId} · ${REVIEW_ASSIGNMENT.reviewerPseudonym}`}
      onClose={onClose}
      canClose={!isSubmitting}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Keep editing
          </Button>
          <Button onClick={evaluation.submitReview} isLoading={isSubmitting} disabled={!canSubmit}>
            {!isSubmitting && <Send aria-hidden />}
            {isSubmitting ? 'Submitting…' : 'Submit peer review'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {!canSubmit && <Alert variant="warning">Finish the required steps before submitting.</Alert>}
        <ReviewSummaryDetails compositeScore={evaluation.compositeScore} scoreBand={evaluation.scoreBand} />
        <CreditBadge />
      </div>
    </Dialog>
  )
}
