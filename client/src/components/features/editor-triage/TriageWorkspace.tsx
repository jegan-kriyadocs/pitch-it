import { useState } from 'react'

import { useSimulatedPlayback } from '@/hooks/useSimulatedPlayback'
import { useSynchronizedSlides } from '@/hooks/useSynchronizedSlides'
import type { DecisionAction, TriageSubmission } from '@/types/editorTriage'
import { SynchronizedSlideViewer } from '@/ui/SynchronizedSlideViewer'
import { AuthorKycCard } from './AuthorKycCard'
import { DecisionActionSuite } from './DecisionActionSuite'
import { DecisionModal } from './DecisionModal'
import { PitchSummaryCard } from './PitchSummaryCard'
import { ReviewerMatcherCard } from './ReviewerMatcherCard'
import { SubmissionHeader } from './SubmissionHeader'
import { SynchronizedPlayer } from './SynchronizedPlayer'
import { TranscriptSearchPanel } from './TranscriptSearchPanel'

interface TriageWorkspaceProps {
  submission: TriageSubmission
}

export function TriageWorkspace({ submission }: TriageWorkspaceProps) {
  const { pitch } = submission
  const playback = useSimulatedPlayback(pitch.durationSeconds)
  const sync = useSynchronizedSlides(pitch, playback.currentSeconds)
  const [activeAction, setActiveAction] = useState<DecisionAction | null>(null)
  const isPitchReady = pitch.status === 'ready'

  function chooseAction(action: DecisionAction) {
    playback.pause()
    setActiveAction(action)
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
      <SubmissionHeader submission={submission} />
      <DecisionActionSuite submission={submission} onChooseAction={chooseAction} />

      <div className="grid items-start gap-5 2xl:grid-cols-[3fr_2fr]">
        <div className="flex min-w-0 flex-col gap-5">
          <SynchronizedPlayer
            submission={submission}
            playback={playback}
            caption={sync.activeCaption}
            activeSlideIndex={sync.activeSlideIndex}
          />
          {isPitchReady && (
            <>
              <SynchronizedSlideViewer
                slides={pitch.slides}
                activeSlideIndex={sync.activeSlideIndex}
                onJumpToSlide={playback.seek}
              />
              <TranscriptSearchPanel
                transcript={pitch.transcript}
                activeSegmentIndex={sync.activeSegmentIndex}
                onSeek={playback.seek}
              />
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          {isPitchReady && <PitchSummaryCard summary={pitch.summary} onSeek={playback.seek} />}
          <AuthorKycCard submission={submission} />
          <ReviewerMatcherCard submission={submission} />
        </div>
      </div>

      {activeAction && (
        <DecisionModal action={activeAction} submission={submission} onClose={() => setActiveAction(null)} />
      )}
    </div>
  )
}
