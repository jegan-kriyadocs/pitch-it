import { Gauge } from 'lucide-react'

import { Badge, type BadgeVariant } from '@/ui/Badge'
import { RatingSlider } from '@/ui/RatingSlider'
import { SectionCard } from '@/ui/SectionCard'
import { RUBRIC_CRITERIA, SCORE_LABELS } from './reviewerFeedbackData'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

interface ScoringRubricMatrixProps {
  compositeScore: number
  scoreBand: { label: string; variant: BadgeVariant }
}

export function ScoringRubricMatrix({ compositeScore, scoreBand }: ScoringRubricMatrixProps) {
  const rubricScores = useReviewerFeedbackStore((state) => state.rubricScores)
  const setRubricScore = useReviewerFeedbackStore((state) => state.setRubricScore)

  return (
    <SectionCard
      step={2}
      title="Score the rubric"
      icon={Gauge}
      description="Rate each criterion from 1 to 5. The weighted score updates as you go."
      actions={
        <div role="status" aria-live="polite" className="flex flex-col items-end gap-1">
          <span className="text-xl font-semibold text-heading tabular-nums">{compositeScore.toFixed(1)} / 5.0</span>
          <Badge variant={scoreBand.variant}>{scoreBand.label}</Badge>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {RUBRIC_CRITERIA.map((criterion) => {
          const score = rubricScores[criterion.id]
          return (
            <RatingSlider
              key={criterion.id}
              label={`${criterion.label} (${Math.round(criterion.weight * 100)}%)`}
              description={criterion.description}
              value={score}
              valueLabel={SCORE_LABELS[score - 1] ?? ''}
              onChange={(value) => setRubricScore(criterion.id, value)}
            />
          )
        })}
      </div>
    </SectionCard>
  )
}
