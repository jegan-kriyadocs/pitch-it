import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { useAuthorStudioStore } from '@/features/author-studio/authorStudioStore'
import { useEditorTriageStore } from '@/features/editor-triage/editorTriageStore'
import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'
import { useToastStore } from '@/lib/toastStore'

afterEach(() => {
  cleanup()
  useAuthorStudioStore.getState().resetAll()
  useEditorTriageStore.getState().resetQueue()
  useReviewerFeedbackStore.getState().resetReview()
  useToastStore.setState({ toasts: [] })
})

