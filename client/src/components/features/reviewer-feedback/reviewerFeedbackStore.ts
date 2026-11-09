import { create } from 'zustand'

import type {
  CritiqueField,
  CritiqueText,
  FeedbackMedia,
  FeedbackMode,
  Recommendation,
  ReviewSubmissionStatus,
  RubricCriterionId,
  RubricScores,
  TimestampAnnotation,
} from '@/types/reviewerFeedback'
import { DEFAULT_RUBRIC_SCORES, INITIAL_ANNOTATIONS, REVIEW_ASSIGNMENT } from './reviewerFeedbackData'

interface ReviewerFeedbackState {
  rubricScores: RubricScores
  recommendation: Recommendation | null
  critique: CritiqueText
  annotations: TimestampAnnotation[]
  feedbackMode: FeedbackMode
  feedbackMedia: FeedbackMedia | null
  isVoiceDisguised: boolean
  isFaceMasked: boolean
  submissionStatus: ReviewSubmissionStatus
  setRubricScore: (criterionId: RubricCriterionId, score: number) => void
  setRecommendation: (recommendation: Recommendation) => void
  setCritique: (field: CritiqueField, text: string) => void
  setAnnotations: (annotations: TimestampAnnotation[]) => void
  setFeedbackMode: (mode: FeedbackMode) => void
  setFeedbackMedia: (media: FeedbackMedia) => void
  clearFeedbackMedia: () => void
  setVoiceDisguised: (isEnabled: boolean) => void
  setFaceMasked: (isEnabled: boolean) => void
  setSubmissionStatus: (status: ReviewSubmissionStatus) => void
  resetReview: () => void
}

const INITIAL_STATE = {
  rubricScores: DEFAULT_RUBRIC_SCORES,
  recommendation: null,
  critique: { commentsToAuthor: '', confidentialCommentsToEditor: '' },
  annotations: INITIAL_ANNOTATIONS,
  feedbackMode: 'video_audio' as FeedbackMode,
  feedbackMedia: null,
  isVoiceDisguised: REVIEW_ASSIGNMENT.isDoubleBlind,
  isFaceMasked: REVIEW_ASSIGNMENT.isDoubleBlind,
  submissionStatus: 'drafting' as ReviewSubmissionStatus,
}

function revokeMedia(media: FeedbackMedia | null) {
  if (media) {
    URL.revokeObjectURL(media.url)
  }
}

export const useReviewerFeedbackStore = create<ReviewerFeedbackState>()((set, get) => ({
  ...INITIAL_STATE,
  setRubricScore: (criterionId, score) =>
    set((state) => ({ rubricScores: { ...state.rubricScores, [criterionId]: score } })),
  setRecommendation: (recommendation) => set({ recommendation }),
  setCritique: (field, text) => set((state) => ({ critique: { ...state.critique, [field]: text } })),
  setAnnotations: (annotations) => set({ annotations }),
  setFeedbackMode: (feedbackMode) => set({ feedbackMode }),
  setFeedbackMedia: (feedbackMedia) => {
    revokeMedia(get().feedbackMedia)
    set({ feedbackMedia })
  },
  clearFeedbackMedia: () => {
    revokeMedia(get().feedbackMedia)
    set({ feedbackMedia: null })
  },
  setVoiceDisguised: (isVoiceDisguised) => set({ isVoiceDisguised }),
  setFaceMasked: (isFaceMasked) => set({ isFaceMasked }),
  setSubmissionStatus: (submissionStatus) => set({ submissionStatus }),
  resetReview: () => {
    revokeMedia(get().feedbackMedia)
    set(INITIAL_STATE)
  },
}))
