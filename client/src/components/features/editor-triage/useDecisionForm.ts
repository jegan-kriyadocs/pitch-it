import { useState } from 'react'

import type { DecisionAction, DecisionRecord, ReviewerVideoAccess } from '@/types/editorTriage'

const MIN_QUERY_LENGTH = 15

interface DecisionFormErrors {
  query?: string
  reasons?: string
}

export function useDecisionForm(action: DecisionAction, defaultVideoAccess: ReviewerVideoAccess) {
  const [notes, setNotes] = useState('')
  const [videoAccess, setVideoAccess] = useState<ReviewerVideoAccess>(defaultVideoAccess)
  const [rejectReasons, setRejectReasons] = useState<string[]>([])
  const [errors, setErrors] = useState<DecisionFormErrors>({})

  function toggleReason(reason: string, isChecked: boolean) {
    setRejectReasons((current) =>
      isChecked ? [...current, reason] : current.filter((item) => item !== reason),
    )
  }

  function validate(): DecisionFormErrors {
    if (action === 'repitch_requested' && notes.trim().length < MIN_QUERY_LENGTH) {
      return { query: `Write at least ${MIN_QUERY_LENGTH} characters so the author knows what to address.` }
    }
    if (action === 'desk_rejected' && rejectReasons.length === 0) {
      return { reasons: 'Choose at least one reason for the rejection.' }
    }
    return {}
  }

  function buildRecord(): DecisionRecord | null {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (nextErrors.query || nextErrors.reasons) {
      return null
    }
    return {
      decision: action,
      notes: notes.trim(),
      reviewerVideoAccess: action === 'accepted_for_review' ? videoAccess : undefined,
      rejectReasons: action === 'desk_rejected' ? rejectReasons : undefined,
      decidedAt: new Date().toISOString(),
    }
  }

  return { notes, setNotes, videoAccess, setVideoAccess, rejectReasons, toggleReason, errors, buildRecord }
}
