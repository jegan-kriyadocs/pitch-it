import type {
  CritiqueField,
  CritiqueText,
  RubricCriterion,
  RubricScores,
  ToneAnalysis,
  ToneFinding,
} from '@/types/reviewerFeedback'
import type { BadgeVariant } from '@/ui/Badge'
import { ACTION_WORDS, TONE_DICTIONARY, WARMTH_WORDS } from './reviewerFeedbackData'

const DAY_MS = 24 * 60 * 60 * 1000
const CRITIQUE_FIELDS: CritiqueField[] = ['commentsToAuthor', 'confidentialCommentsToEditor']

export type MarkdownSyntax = 'bold' | 'italic' | 'heading' | 'bullet' | 'quote'

export function computeCompositeScore(scores: RubricScores, criteria: readonly RubricCriterion[]) {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  const weightedSum = criteria.reduce((sum, criterion) => sum + scores[criterion.id] * criterion.weight, 0)
  return Math.round((weightedSum / totalWeight) * 10) / 10
}

export function getScoreBand(score: number): { label: string; variant: BadgeVariant } {
  if (score >= 4.2) {
    return { label: 'Strong candidate', variant: 'success' }
  }
  if (score >= 3.4) {
    return { label: 'Promising with revisions', variant: 'info' }
  }
  if (score >= 2.5) {
    return { label: 'Major concerns', variant: 'warning' }
  }
  return { label: 'Not suitable', variant: 'danger' }
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function clampPercent(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)))
}

function countMatches(text: string, words: readonly string[]) {
  const lowerText = text.toLowerCase()
  return words.reduce((sum, word) => sum + (lowerText.split(word).length - 1), 0)
}

export function findHarshPhrases(critique: CritiqueText): ToneFinding[] {
  return CRITIQUE_FIELDS.flatMap((field) => {
    const lowerText = critique[field].toLowerCase()
    return TONE_DICTIONARY.filter(({ phrase }) => lowerText.includes(phrase.toLowerCase())).map(
      ({ phrase, suggestion }) => ({ field, phrase, suggestion }),
    )
  })
}

export function analyzeTone(critique: CritiqueText): ToneAnalysis {
  const combinedText = `${critique.commentsToAuthor} ${critique.confidentialCommentsToEditor}`.trim()
  const findings = findHarshPhrases(critique)
  if (!combinedText) {
    return { warmthScore: 0, actionabilityScore: 0, findings }
  }
  const sentences = combinedText.split(/[.!?]+/).filter((sentence) => sentence.trim())
  const actionableSentences = sentences.filter((sentence) => countMatches(sentence, ACTION_WORDS) > 0)
  return {
    warmthScore: clampPercent(55 + countMatches(combinedText, WARMTH_WORDS) * 10 - findings.length * 20),
    actionabilityScore: clampPercent((actionableSentences.length / Math.max(sentences.length, 1)) * 100),
    findings,
  }
}

export function replacePhrase(text: string, phrase: string, replacement: string) {
  const index = text.toLowerCase().indexOf(phrase.toLowerCase())
  if (index === -1) {
    return text
  }
  return `${text.slice(0, index)}${replacement}${text.slice(index + phrase.length)}`
}

export function insertMarkdown(text: string, selectionStart: number, selectionEnd: number, syntax: MarkdownSyntax) {
  const selected = text.slice(selectionStart, selectionEnd) || 'text'
  const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1
  const wrappers: Record<'bold' | 'italic', string> = { bold: '**', italic: '_' }
  const linePrefixes: Record<'heading' | 'bullet' | 'quote', string> = { heading: '### ', bullet: '- ', quote: '> ' }

  if (syntax === 'bold' || syntax === 'italic') {
    const wrapper = wrappers[syntax]
    const inserted = `${wrapper}${selected}${wrapper}`
    return {
      text: `${text.slice(0, selectionStart)}${inserted}${text.slice(selectionEnd)}`,
      cursor: selectionStart + inserted.length,
    }
  }
  const prefix = linePrefixes[syntax]
  return {
    text: `${text.slice(0, lineStart)}${prefix}${text.slice(lineStart)}`,
    cursor: selectionEnd + prefix.length,
  }
}

export function getDaysRemaining(deadlineIso: string, now: Date) {
  return Math.max(0, Math.ceil((new Date(deadlineIso).getTime() - now.getTime()) / DAY_MS))
}
