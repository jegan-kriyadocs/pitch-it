import { CircleCheck, Circle, LoaderCircle } from 'lucide-react'

import type { CadmoreResult, CadmoreStage } from '@/hooks/useCadmoreDirectUpload'
import { Alert } from '@/ui/Alert'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { ProgressBar } from '@/ui/ProgressBar'

interface CadmoreUploadProgressProps {
  stage: CadmoreStage
  progress: number
  result: CadmoreResult | null
  onClose: () => void
}

const STEPS: { stage: CadmoreStage; label: string }[] = [
  { stage: 'uploading', label: 'Uploading to Cadmore' },
  { stage: 'transcoding', label: 'Creating adaptive streams' },
  { stage: 'captioning', label: 'Generating captions (VTT)' },
]

const STAGE_ORDER: CadmoreStage[] = ['idle', 'uploading', 'transcoding', 'captioning', 'complete']

function StepRow({ label, status, progress }: { label: string; status: 'done' | 'active' | 'pending'; progress: number }) {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        {status === 'done' && <CircleCheck size={16} aria-hidden className="text-green-700" />}
        {status === 'active' && <LoaderCircle size={16} aria-hidden className="text-brand-600 motion-safe:animate-spin" />}
        {status === 'pending' && <Circle size={16} aria-hidden className="text-gray-300" />}
        <span className={status === 'pending' ? 'text-muted' : 'font-semibold text-heading'}>{label}</span>
        {status === 'active' && <span className="ml-auto text-[13px] text-muted tabular-nums">{progress}%</span>}
      </div>
      {status === 'active' && (
        <ProgressBar label={label} value={progress} />
      )}
    </li>
  )
}

export function CadmoreUploadProgress({ stage, progress, result, onClose }: CadmoreUploadProgressProps) {
  const isComplete = stage === 'complete'
  const currentIndex = STAGE_ORDER.indexOf(stage)

  return (
    <Dialog
      title={isComplete ? 'Pitch submitted' : 'Submitting your pitch'}
      description={isComplete ? 'The editor can now watch your pitch.' : 'Keep this window open until it finishes.'}
      onClose={onClose}
      canClose={isComplete}
      footer={
        <Button onClick={onClose} disabled={!isComplete} data-autofocus>
          {isComplete ? 'Done' : 'Please wait…'}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <ol aria-live="polite" className="flex flex-col gap-4">
          {STEPS.map((step) => {
            const stepIndex = STAGE_ORDER.indexOf(step.stage)
            const status = stepIndex < currentIndex ? 'done' : stepIndex === currentIndex ? 'active' : 'pending'
            return <StepRow key={step.stage} label={step.label} status={status} progress={progress} />
          })}
        </ol>
        {isComplete && result && (
          <>
            <Alert variant="success">Your pitch is streaming-ready with captions.</Alert>
            <dl className="grid gap-2 text-[13px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
              <dt className="text-muted">Video DOI</dt>
              <dd className="font-medium break-all text-heading">{result.videoDoi}</dd>
              <dt className="text-muted">Stream</dt>
              <dd className="break-all text-heading">{result.playbackUrl}</dd>
              <dt className="text-muted">Captions</dt>
              <dd className="break-all text-heading">{result.captionsUrl}</dd>
            </dl>
          </>
        )}
      </div>
    </Dialog>
  )
}
