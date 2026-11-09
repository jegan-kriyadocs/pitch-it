import { showToast } from '@/lib/toastStore'
import type { DecisionAction, DecisionRecord, TriageSubmission } from '@/types/editorTriage'
import { Alert } from '@/ui/Alert'
import { Button } from '@/ui/Button'
import { CheckboxField } from '@/ui/CheckboxField'
import { Dialog } from '@/ui/Dialog'
import { TextAreaField } from '@/ui/TextAreaField'
import { DESK_REJECT_REASONS, REPITCH_PROMPTS } from './editorTriageData'
import { useEditorTriageStore } from './editorTriageStore'
import { getVideoAccessLabel, ReviewerVisibilityPicker } from './ReviewerVisibilityPicker'
import { useDecisionForm } from './useDecisionForm'

const DECISION_COPY: Record<DecisionAction, { title: string; confirmLabel: string; toastTitle: string }> = {
  accepted_for_review: { title: 'Accept for peer review', confirmLabel: 'Accept and route', toastTitle: 'Accepted for peer review' },
  repitch_requested: { title: 'Request a re-pitch', confirmLabel: 'Send request', toastTitle: 'Re-pitch requested' },
  desk_rejected: { title: 'Desk reject', confirmLabel: 'Reject and notify', toastTitle: 'Desk rejected' },
}

function toastDescription(record: DecisionRecord) {
  if (record.decision === 'accepted_for_review' && record.reviewerVideoAccess) {
    return `Reviewers will see: ${getVideoAccessLabel(record.reviewerVideoAccess)}.`
  }
  if (record.decision === 'repitch_requested') {
    return 'The author has been asked to record a new pitch.'
  }
  return 'A courteous notice has been sent to the author.'
}

interface DecisionModalProps {
  action: DecisionAction
  submission: TriageSubmission
  onClose: () => void
}

export function DecisionModal({ action, submission, onClose }: DecisionModalProps) {
  const applyDecision = useEditorTriageStore((state) => state.applyDecision)
  const form = useDecisionForm(action, submission.pitch.isAnonymized ? 'anonymized_stream_only' : 'full_video')
  const copy = DECISION_COPY[action]

  function confirm() {
    const record = form.buildRecord()
    if (!record) {
      return
    }
    applyDecision(submission.manuscriptId, record)
    showToast({ variant: action === 'desk_rejected' ? 'info' : 'success', title: copy.toastTitle, description: toastDescription(record) })
    onClose()
  }

  return (
    <Dialog
      title={copy.title}
      description={`${submission.manuscriptId} · ${submission.title}`}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={action === 'desk_rejected' ? 'danger' : 'primary'} onClick={confirm}>
            {copy.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {action === 'accepted_for_review' && submission.kycStatus === 'flagged' && (
          <Alert variant="warning">Author identity is flagged. Consider requesting a re-pitch first.</Alert>
        )}
        {action === 'accepted_for_review' && (
          <ReviewerVisibilityPicker value={form.videoAccess} onChange={form.setVideoAccess} />
        )}
        {action === 'repitch_requested' && (
          <div className="flex flex-wrap gap-2">
            {REPITCH_PROMPTS.map((prompt) => (
              <Button key={prompt} variant="secondary" size="sm" onClick={() => form.setNotes(prompt)} className="h-auto py-1.5 whitespace-normal text-left">
                {prompt}
              </Button>
            ))}
          </div>
        )}
        {action === 'desk_rejected' && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-sm font-semibold text-heading">Reasons</legend>
            {DESK_REJECT_REASONS.map((reason) => (
              <CheckboxField
                key={reason}
                label={reason}
                isChecked={form.rejectReasons.includes(reason)}
                onChange={(isChecked) => form.toggleReason(reason, isChecked)}
              />
            ))}
            {form.errors.reasons && (
              <p role="alert" className="text-[13px] text-red-700">
                {form.errors.reasons}
              </p>
            )}
          </fieldset>
        )}
        <TextAreaField
          label={action === 'repitch_requested' ? 'Question for the author' : 'Editorial notes'}
          hint={action === 'repitch_requested' ? 'Pick a suggestion above or write your own.' : 'Optional. Visible to the editorial team.'}
          value={form.notes}
          onChange={(event) => form.setNotes(event.target.value)}
          errorMessage={form.errors.query}
          data-autofocus
        />
      </div>
    </Dialog>
  )
}
