import { describe, expect, it } from 'vitest'

import { RUBRIC_CRITERIA } from '@/features/reviewer-feedback/reviewerFeedbackData'
import {
  analyzeTone,
  computeCompositeScore,
  countWords,
  getDaysRemaining,
  getScoreBand,
  insertMarkdown,
  replacePhrase,
} from '@/features/reviewer-feedback/reviewerFeedbackRules'

describe('reviewerFeedbackRules', () => {
  it('weights rubric scores into a composite', () => {
    const scores = { methodologicalRigor: 4, scientificOriginality: 5, statisticalProof: 3, clinicalSignificance: 4 }
    expect(computeCompositeScore(scores, RUBRIC_CRITERIA)).toBe(4)
  })

  it('classifies composite scores', () => {
    expect(getScoreBand(4.2).label).toBe('Strong candidate')
    expect(getScoreBand(3.5).label).toBe('Promising with revisions')
    expect(getScoreBand(2.6).label).toBe('Major concerns')
    expect(getScoreBand(1.8).label).toBe('Not suitable')
  })

  it('flags harsh phrasing and lowers warmth', () => {
    const analysis = analyzeTone({
      commentsToAuthor: 'The authors clearly fail to report confidence intervals.',
      confidentialCommentsToEditor: '',
    })
    expect(analysis.findings).toEqual([
      {
        field: 'commentsToAuthor',
        phrase: 'The authors clearly fail to',
        suggestion: 'The authors should consider clarifying',
      },
    ])
    expect(analysis.warmthScore).toBeLessThan(55)
  })

  it('scores collegial, actionable text highly', () => {
    const analysis = analyzeTone({
      commentsToAuthor: 'Thank you for a promising study. Please report the 95% CI.',
      confidentialCommentsToEditor: '',
    })
    expect(analysis.findings).toHaveLength(0)
    expect(analysis.warmthScore).toBeGreaterThanOrEqual(70)
    expect(analysis.actionabilityScore).toBe(50)
  })

  it('replaces a phrase case-insensitively', () => {
    expect(replacePhrase('This is WRONG here', 'this is wrong', 'This may need to be revisited')).toBe(
      'This may need to be revisited here',
    )
  })

  it('wraps a selection in bold and prefixes a bullet', () => {
    expect(insertMarkdown('make bold now', 5, 9, 'bold')).toEqual({ text: 'make **bold** now', cursor: 13 })
    expect(insertMarkdown('first\nsecond', 8, 8, 'bullet').text).toBe('first\n- second')
  })

  it('counts words and days remaining', () => {
    expect(countWords('  two words ')).toBe(2)
    expect(getDaysRemaining('2026-11-24T23:59:00Z', new Date('2026-11-10T09:00:00Z'))).toBe(15)
  })
})
