import { describe, expect, it } from 'vitest'

import { TRIAGE_SUBMISSIONS } from './editorTriageData'
import { findActiveIndex, getPitchBadge, matchesFilter, matchesSearch } from './editorTriageRules'

const [oncology, genetics, cardiology, immunology] = TRIAGE_SUBMISSIONS

describe('editorTriageRules', () => {
  it('labels pitch status for the queue', () => {
    expect(getPitchBadge(oncology!.pitch).label).toBe('Ready 2m 14s')
    expect(getPitchBadge(cardiology!.pitch).label).toBe('Processing')
  })

  it('flags submissions with KYC warnings or high risk', () => {
    expect(matchesFilter(immunology!, 'flagged')).toBe(true)
    expect(matchesFilter(cardiology!, 'flagged')).toBe(true)
    expect(matchesFilter(genetics!, 'flagged')).toBe(false)
  })

  it('separates pending and decided submissions', () => {
    const decided = { ...oncology!, decision: 'desk_rejected' as const }
    expect(matchesFilter(decided, 'decided')).toBe(true)
    expect(matchesFilter(decided, 'pending')).toBe(false)
  })

  it('searches by ID, title and tags', () => {
    expect(matchesSearch(genetics!, 'genetics')).toBe(true)
    expect(matchesSearch(genetics!, '09014')).toBe(true)
    expect(matchesSearch(genetics!, 'cardiology')).toBe(false)
  })

  it('finds the active item for a playback time', () => {
    const items = [{ startSeconds: 0 }, { startSeconds: 30 }, { startSeconds: 60 }]
    expect(findActiveIndex(items, 0)).toBe(0)
    expect(findActiveIndex(items, 45)).toBe(1)
    expect(findActiveIndex(items, 90)).toBe(2)
  })
})
