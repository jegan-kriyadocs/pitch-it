import { useEffect, useRef } from 'react'

import { MIN_AUTHOR_COMMENT_WORDS, RUBRIC_CRITERIA } from '@/features/reviewer-feedback/reviewerFeedbackData'
import { computeCompositeScore, countWords, getScoreBand } from '@/features/reviewer-feedback/reviewerFeedbackRules'
import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'
import { showToast } from '@/lib/toastStore'

const SUBMIT_DELAY_MS = 1500

export interface ChecklistItem {
  label: string
  isDone: boolean
  isRequired: boolean
}

export type ReviewerEvaluation = ReturnType<typeof useReviewerEvaluation>

export function useReviewerEvaluation() {
  const rubricScores = useReviewerFeedbackStore((state) => state.rubricScores)
  const recommendation = useReviewerFeedbackStore((state) => state.recommendation)
  const critique = useReviewerFeedbackStore((state) => state.critique)
  const feedbackMedia = useReviewerFeedbackStore((state) => state.feedbackMedia)
  const submissionStatus = useReviewerFeedbackStore((state) => state.submissionStatus)
  const setSubmissionStatus = useReviewerFeedbackStore((state) => state.setSubmissionStatus)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const compositeScore = computeCompositeScore(rubricScores, RUBRIC_CRITERIA)
  const authorCommentWords = countWords(critique.commentsToAuthor)
  const checklist: ChecklistItem[] = [
    { label: 'Rubric scored', isDone: true, isRequired: true },
    { label: 'Recommendation chosen', isDone: recommendation !== null, isRequired: true },
    {
      label: `Comments for authors (${MIN_AUTHOR_COMMENT_WORDS}+ words)`,
      isDone: authorCommentWords >= MIN_AUTHOR_COMMENT_WORDS,
      isRequired: true,
    },
    { label: '90-second feedback recorded', isDone: feedbackMedia !== null, isRequired: false },
  ]
  const canSubmit = checklist.every((item) => item.isDone || !item.isRequired)

  function submitReview() {
    if (!canSubmit || submissionStatus !== 'drafting') {
      return
    }
    setSubmissionStatus('submitting')
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      setSubmissionStatus('submitted')
      showToast({
        variant: 'success',
        title: 'Peer review submitted',
        description: 'Review credit is on its way to your ORCID and Web of Science profiles.',
      })
    }, SUBMIT_DELAY_MS)
  }

  return {
    compositeScore,
    scoreBand: getScoreBand(compositeScore),
    authorCommentWords,
    checklist,
    canSubmit,
    submissionStatus,
    submitReview,
  }
}
