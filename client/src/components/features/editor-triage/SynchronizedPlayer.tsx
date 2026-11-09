import { LoaderCircle, VideoOff } from 'lucide-react'

import type { SimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import type { TriageSubmission } from '@/types/editorTriage'
import { Card } from '@/ui/Card'
import { EmptyState } from '@/ui/EmptyState'
import { ProgressBar } from '@/ui/ProgressBar'
import { SimulatedPitchPlayer } from '@/ui/SimulatedPitchPlayer'

interface SynchronizedPlayerProps {
  submission: TriageSubmission
  playback: SimulatedPlayback
  caption: string
  activeSlideIndex: number
}

function PendingPitch({ submission }: { submission: TriageSubmission }) {
  const { pitch } = submission
  if (pitch.status === 'processing') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <EmptyState
          icon={LoaderCircle}
          title="Pitch video is processing"
          description="Cadmore is transcoding the video and generating captions. You can still review the author's identity below."
        />
        <ProgressBar label="Processing progress" value={pitch.processingPercent ?? 0} className="w-full max-w-sm" />
        <span className="text-[13px] text-muted">{pitch.processingPercent ?? 0}% complete</span>
      </div>
    )
  }
  return (
    <EmptyState
      icon={VideoOff}
      title="No pitch video"
      description="The author submitted without a video pitch. Triage from the manuscript instead."
      className="py-10"
    />
  )
}

export function SynchronizedPlayer({ submission, playback, caption, activeSlideIndex }: SynchronizedPlayerProps) {
  const { pitch } = submission

  return (
    <Card className="p-4">
      {pitch.status === 'ready' ? (
        <SimulatedPitchPlayer
          presenterLabel={pitch.isAnonymized ? 'Anonymized presenter' : submission.author.displayName}
          isAnonymized={pitch.isAnonymized}
          durationSeconds={pitch.durationSeconds}
          slides={pitch.slides}
          playback={playback}
          caption={caption}
          activeSlideIndex={activeSlideIndex}
        />
      ) : (
        <PendingPitch submission={submission} />
      )}
    </Card>
  )
}
