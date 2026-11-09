import { useState } from 'react'

import { analyzeTone, replacePhrase } from '@/features/reviewer-feedback/reviewerFeedbackRules'
import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'
import type { ToneFinding } from '@/types/reviewerFeedback'
import { useDebouncedValue } from './useDebouncedValue'

const ANALYSIS_DELAY_MS = 300

export function useToneAnalysis() {
  const critique = useReviewerFeedbackStore((state) => state.critique)
  const setCritique = useReviewerFeedbackStore((state) => state.setCritique)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const debouncedCritique = useDebouncedValue(critique, ANALYSIS_DELAY_MS)
  const analysis = analyzeTone(debouncedCritique)

  function applySuggestion(finding: ToneFinding) {
    setCritique(finding.field, replacePhrase(critique[finding.field], finding.phrase, finding.suggestion))
  }

  return {
    analysis,
    hasAnalyzed,
    runAnalysis: () => setHasAnalyzed(true),
    applySuggestion,
  }
}
