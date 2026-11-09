import { useState } from 'react'

import {
  matchesFilter,
  matchesSearch,
  needsAttention,
  type QueueFilter,
} from '@/features/editor-triage/editorTriageRules'
import { useEditorTriageStore } from '@/features/editor-triage/editorTriageStore'

export type TriageQueue = ReturnType<typeof useTriageQueue>

export function useTriageQueue() {
  const submissions = useEditorTriageStore((state) => state.submissions)
  const selectedId = useEditorTriageStore((state) => state.selectedId)
  const selectSubmission = useEditorTriageStore((state) => state.selectSubmission)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<QueueFilter>('all')

  const visibleSubmissions = submissions.filter(
    (submission) => matchesFilter(submission, filter) && matchesSearch(submission, searchQuery),
  )
  const selectedSubmission =
    submissions.find((submission) => submission.manuscriptId === selectedId) ?? null

  return {
    visibleSubmissions,
    selectedSubmission,
    selectedId,
    selectSubmission,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    counts: {
      total: submissions.length,
      pending: submissions.filter((submission) => submission.decision === 'pending').length,
      flagged: submissions.filter(needsAttention).length,
    },
  }
}
