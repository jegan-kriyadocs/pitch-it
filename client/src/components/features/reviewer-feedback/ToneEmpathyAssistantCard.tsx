import { ArrowRight, HeartHandshake, Wand2 } from 'lucide-react'

import { useToneAnalysis } from '@/hooks/useToneAnalysis'
import { Alert } from '@/ui/Alert'
import { Button } from '@/ui/Button'
import { ProgressBar } from '@/ui/ProgressBar'
import { SectionCard } from '@/ui/SectionCard'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

const FIELD_LABELS = { commentsToAuthor: 'Comments for authors', confidentialCommentsToEditor: 'Confidential to editor' }

function scoreTone(score: number) {
  if (score >= 70) return 'success'
  if (score >= 40) return 'warning'
  return 'danger'
}

export function ToneEmpathyAssistantCard() {
  const critique = useReviewerFeedbackStore((state) => state.critique)
  const { analysis, hasAnalyzed, runAnalysis, applySuggestion } = useToneAnalysis()
  const hasText = Boolean(critique.commentsToAuthor.trim() || critique.confidentialCommentsToEditor.trim())
  const metrics = [
    { label: 'Warmth', value: analysis.warmthScore },
    { label: 'Actionability', value: analysis.actionabilityScore },
  ]

  return (
    <SectionCard
      title="Constructive tone check"
      icon={HeartHandshake}
      description="AI flags harsh phrasing and suggests collegial alternatives."
      actions={
        <Button variant="secondary" size="sm" onClick={runAnalysis} disabled={!hasText}>
          <Wand2 aria-hidden />
          Analyze tone
        </Button>
      }
    >
      {!hasAnalyzed ? (
        <p className="text-[13px] text-muted">Write your critique, then analyze its tone before submitting.</p>
      ) : (
        <div aria-live="polite" className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold text-heading">{metric.label}</span>
                  <span className="text-body tabular-nums">{metric.value} / 100</span>
                </div>
                <ProgressBar label={metric.label} value={metric.value} tone={scoreTone(metric.value)} />
              </div>
            ))}
          </div>
          {analysis.findings.length === 0 ? (
            <Alert variant="success">No harsh phrasing found. Your critique reads as collegial.</Alert>
          ) : (
            <ul aria-label="Tone suggestions" className="flex flex-col gap-2">
              {analysis.findings.map((finding) => (
                <li key={`${finding.field}-${finding.phrase}`} className="flex flex-col gap-2 rounded-base border border-amber-200 bg-amber-50 p-3">
                  <span className="text-[11px] font-semibold tracking-[0.06em] text-amber-800 uppercase">{FIELD_LABELS[finding.field]}</span>
                  <p className="text-sm text-heading">
                    <span className="sr-only">Harsh phrase: </span>
                    <del className="text-red-700">“{finding.phrase}”</del>
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => applySuggestion(finding)} className="h-auto self-start py-1.5 text-left whitespace-normal">
                    <ArrowRight aria-hidden />
                    Replace with “{finding.suggestion}”
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </SectionCard>
  )
}
