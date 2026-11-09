import type { ReactNode } from 'react'

import { formatClock } from '@/lib/formatTime'
import type { RubricScores } from '@/types/reviewerFeedback'
import { Badge, type BadgeVariant } from '@/ui/Badge'
import { getRecommendationLabel } from './RecommendationDecisionCard'
import { RUBRIC_CRITERIA } from './reviewerFeedbackData'
import { countWords } from './reviewerFeedbackRules'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

const EXCERPT_LENGTH = 180

interface ReviewSummaryDetailsProps {
  compositeScore: number
  scoreBand: { label: string; variant: BadgeVariant }
}

function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-[13px] font-semibold text-heading">{term}</dt>
      <dd className="min-w-0 flex-1 text-[13px] text-body">{children}</dd>
    </div>
  )
}

function describeScores(scores: RubricScores) {
  return RUBRIC_CRITERIA.map((criterion) => `${criterion.label.split(' &')[0]}: ${scores[criterion.id]}`).join(' · ')
}

export function ReviewSummaryDetails({ compositeScore, scoreBand }: ReviewSummaryDetailsProps) {
  const rubricScores = useReviewerFeedbackStore((state) => state.rubricScores)
  const recommendation = useReviewerFeedbackStore((state) => state.recommendation)
  const feedbackMedia = useReviewerFeedbackStore((state) => state.feedbackMedia)
  const critique = useReviewerFeedbackStore((state) => state.critique)
  const annotationCount = useReviewerFeedbackStore((state) => state.annotations.length)
  const isVoiceDisguised = useReviewerFeedbackStore((state) => state.isVoiceDisguised)
  const isFaceMasked = useReviewerFeedbackStore((state) => state.isFaceMasked)
  const excerpt = critique.commentsToAuthor.slice(0, EXCERPT_LENGTH)

  return (
    <dl>
      <SummaryRow term="Rubric">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-heading">{compositeScore.toFixed(1)} / 5.0</span>
          <Badge variant={scoreBand.variant}>{scoreBand.label}</Badge>
        </span>
        <span className="mt-1 block">{describeScores(rubricScores)}</span>
      </SummaryRow>
      <SummaryRow term="Recommendation">{getRecommendationLabel(recommendation)}</SummaryRow>
      <SummaryRow term="Spoken feedback">
        {feedbackMedia
          ? `${feedbackMedia.mode === 'video_audio' ? 'Video + audio' : 'Audio only'} · ${formatClock(feedbackMedia.durationSeconds)} · Voice disguise ${isVoiceDisguised ? 'on' : 'off'}${feedbackMedia.mode === 'video_audio' ? ` · Face ${isFaceMasked ? 'hidden' : 'visible'}` : ''}`
          : 'None recorded'}
      </SummaryRow>
      <SummaryRow term="Pinned notes">{annotationCount}</SummaryRow>
      <SummaryRow term="Comments for authors">
        {countWords(critique.commentsToAuthor)} words
        {excerpt && <span className="mt-1 block whitespace-pre-line text-muted">“{excerpt}{critique.commentsToAuthor.length > EXCERPT_LENGTH ? '…' : ''}”</span>}
      </SummaryRow>
      <SummaryRow term="Confidential to editor">{countWords(critique.confidentialCommentsToEditor)} words</SummaryRow>
    </dl>
  )
}
