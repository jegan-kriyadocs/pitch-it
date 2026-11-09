import { create } from 'zustand'

import type { DecisionRecord, TriageSubmission } from '@/types/editorTriage'
import { TRIAGE_SUBMISSIONS } from './editorTriageData'

interface EditorTriageState {
  submissions: TriageSubmission[]
  selectedId: string
  selectSubmission: (manuscriptId: string) => void
  applyDecision: (manuscriptId: string, record: DecisionRecord) => void
  undoDecision: (manuscriptId: string) => void
  inviteReviewer: (manuscriptId: string, reviewerId: string) => void
  resetQueue: () => void
}

function updateSubmission(
  submissions: TriageSubmission[],
  manuscriptId: string,
  update: (submission: TriageSubmission) => TriageSubmission,
) {
  return submissions.map((submission) =>
    submission.manuscriptId === manuscriptId ? update(submission) : submission,
  )
}

const INITIAL_SELECTED_ID = TRIAGE_SUBMISSIONS[0]?.manuscriptId ?? ''

export const useEditorTriageStore = create<EditorTriageState>()((set) => ({
  submissions: TRIAGE_SUBMISSIONS,
  selectedId: INITIAL_SELECTED_ID,
  selectSubmission: (selectedId) => set({ selectedId }),
  applyDecision: (manuscriptId, record) =>
    set((state) => ({
      submissions: updateSubmission(state.submissions, manuscriptId, (submission) => ({
        ...submission,
        decision: record.decision,
        decisionRecord: record,
      })),
    })),
  undoDecision: (manuscriptId) =>
    set((state) => ({
      submissions: updateSubmission(state.submissions, manuscriptId, (submission) => ({
        ...submission,
        decision: 'pending',
        decisionRecord: undefined,
        invitedReviewerIds: [],
      })),
    })),
  inviteReviewer: (manuscriptId, reviewerId) =>
    set((state) => ({
      submissions: updateSubmission(state.submissions, manuscriptId, (submission) => ({
        ...submission,
        invitedReviewerIds: submission.invitedReviewerIds.includes(reviewerId)
          ? submission.invitedReviewerIds
          : [...submission.invitedReviewerIds, reviewerId],
      })),
    })),
  resetQueue: () => set({ submissions: TRIAGE_SUBMISSIONS, selectedId: INITIAL_SELECTED_ID }),
}))
