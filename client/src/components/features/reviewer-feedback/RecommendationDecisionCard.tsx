import { CircleCheck, FilePen, FileWarning, Gavel, Undo2 } from 'lucide-react'

import type { Recommendation } from '@/types/reviewerFeedback'
import { RadioCardGroup } from '@/ui/RadioCardGroup'
import { SectionCard } from '@/ui/SectionCard'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

export const RECOMMENDATION_OPTIONS = [
  { value: 'accept', label: 'Accept without revision', description: 'Ready to publish as submitted.', icon: CircleCheck },
  { value: 'minor_revision', label: 'Minor revision', description: 'Small clarifications; no new analyses.', icon: FilePen },
  { value: 'major_revision', label: 'Major revision', description: 'New analyses or substantial rewriting needed.', icon: FileWarning },
  { value: 'reject_transfer', label: 'Reject & suggest transfer', description: 'Not suitable here; may fit a sister journal.', icon: Undo2 },
] as const

export function getRecommendationLabel(recommendation: Recommendation | null) {
  return RECOMMENDATION_OPTIONS.find((option) => option.value === recommendation)?.label ?? 'Not chosen'
}

export function RecommendationDecisionCard() {
  const recommendation = useReviewerFeedbackStore((state) => state.recommendation)
  const setRecommendation = useReviewerFeedbackStore((state) => state.setRecommendation)

  return (
    <SectionCard step={5} title="Your recommendation" icon={Gavel} description="This goes to the editor with your review.">
      <RadioCardGroup<Recommendation>
        legend="Recommendation to the editor"
        options={RECOMMENDATION_OPTIONS}
        value={recommendation}
        onChange={setRecommendation}
      />
    </SectionCard>
  )
}
