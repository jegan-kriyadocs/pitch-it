import { useState } from 'react'

import { CritiqueMarkdownEditor } from '@/features/reviewer-feedback/CritiqueMarkdownEditor'
import { RecommendationDecisionCard } from '@/features/reviewer-feedback/RecommendationDecisionCard'
import { ReviewerHeaderBar } from '@/features/reviewer-feedback/ReviewerHeaderBar'
import { ReviewerMediaRecorder } from '@/features/reviewer-feedback/ReviewerMediaRecorder'
import { ReviewerPitchPanel } from '@/features/reviewer-feedback/ReviewerPitchPanel'
import { REVIEW_ASSIGNMENT } from '@/features/reviewer-feedback/reviewerFeedbackData'
import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'
import { ReviewSubmissionSummaryModal } from '@/features/reviewer-feedback/ReviewSubmissionSummaryModal'
import { ReviewSubmitBar } from '@/features/reviewer-feedback/ReviewSubmitBar'
import { ScoringRubricMatrix } from '@/features/reviewer-feedback/ScoringRubricMatrix'
import { ToneEmpathyAssistantCard } from '@/features/reviewer-feedback/ToneEmpathyAssistantCard'
import { VoiceDisguisePreviewCard } from '@/features/reviewer-feedback/VoiceDisguisePreviewCard'
import { useReviewerEvaluation } from '@/hooks/useReviewerEvaluation'
import { cn } from '@/lib/cn'

export function ReviewerEvaluationStudioPage() {
  const evaluation = useReviewerEvaluation()
  const resetReview = useReviewerFeedbackStore((state) => state.resetReview)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const isSubmitted = evaluation.submissionStatus === 'submitted'

  return (
    <div className="flex flex-col gap-5">
      <ReviewerHeaderBar assignment={REVIEW_ASSIGNMENT} />

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section aria-label="Author pitch" className="flex min-w-0 flex-col gap-5">
          <ReviewerPitchPanel pitch={REVIEW_ASSIGNMENT.pitch} />
        </section>
        <section
          aria-label="Your review"
          inert={isSubmitted}
          className={cn('flex min-w-0 flex-col gap-5', isSubmitted && 'opacity-60')}
        >
          <ScoringRubricMatrix compositeScore={evaluation.compositeScore} scoreBand={evaluation.scoreBand} />
          <ReviewerMediaRecorder />
          <VoiceDisguisePreviewCard />
          <CritiqueMarkdownEditor />
          <ToneEmpathyAssistantCard />
          <RecommendationDecisionCard />
        </section>
      </div>

      <ReviewSubmitBar
        evaluation={evaluation}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onStartOver={resetReview}
      />

      {isSummaryOpen && (
        <ReviewSubmissionSummaryModal evaluation={evaluation} onClose={() => setIsSummaryOpen(false)} />
      )}
    </div>
  )
}
