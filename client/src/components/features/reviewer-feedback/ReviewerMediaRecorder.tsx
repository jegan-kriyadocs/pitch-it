import { CircleCheck, Mic, MessageCircleHeart, RotateCcw, Video } from 'lucide-react'

import { isMediaRecorderSupported } from '@/hooks/useMediaRecorder'
import { useReviewerRecorder } from '@/hooks/useReviewerRecorder'
import { formatClock } from '@/lib/formatTime'
import type { FeedbackMode } from '@/types/reviewerFeedback'
import { Alert } from '@/ui/Alert'
import { AudioLevelMeter } from '@/ui/AudioLevelMeter'
import { Button } from '@/ui/Button'
import { CameraViewfinder } from '@/ui/CameraViewfinder'
import { ConfirmDialog } from '@/ui/ConfirmDialog'
import { CountdownOverlay } from '@/ui/CountdownOverlay'
import { RecordingControls } from '@/ui/RecordingControls'
import { SectionCard } from '@/ui/SectionCard'
import { SegmentedControl } from '@/ui/SegmentedControl'
import { FEEDBACK_CUES, FEEDBACK_MAX_SECONDS, FEEDBACK_WARNING_SECONDS } from './reviewerFeedbackData'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

const MODE_OPTIONS = [
  { value: 'video_audio', label: 'Video + audio', icon: Video },
  { value: 'audio_only', label: 'Audio only', icon: Mic },
] as const

export function ReviewerMediaRecorder() {
  const feedbackMode = useReviewerFeedbackStore((state) => state.feedbackMode)
  const isFaceMasked = useReviewerFeedbackStore((state) => state.isFaceMasked)
  const setFeedbackMode = useReviewerFeedbackStore((state) => state.setFeedbackMode)
  const session = useReviewerRecorder()
  const { media, recorder, countdown, feedbackMedia } = session

  return (
    <SectionCard
      step={3}
      title="Record 90-second feedback"
      icon={MessageCircleHeart}
      description="A short spoken note makes critique feel collegial. It's optional but encouraged."
    >
      <SegmentedControl<FeedbackMode>
        label="Recording mode"
        options={MODE_OPTIONS}
        value={feedbackMode}
        isDisabled={session.isBusy || feedbackMedia !== null}
        onChange={setFeedbackMode}
      />
      <ol className="flex list-decimal flex-col gap-1 rounded-base bg-amber-50/70 py-3 pr-3 pl-8 text-sm text-heading-secondary">
        {FEEDBACK_CUES.map((cue) => (
          <li key={cue}>{cue}</li>
        ))}
      </ol>
      {!isMediaRecorderSupported() && <Alert variant="error">This browser can't record. Please use the written critique.</Alert>}
      {media.status === 'simulated' && (
        <Alert variant="info">{media.fallbackReason} A simulated stream is in use so you can still try recording.</Alert>
      )}
      {media.status === 'unavailable' && (
        <Alert variant="error">{media.fallbackReason} Please use the written critique instead.</Alert>
      )}

      {feedbackMedia ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-base border border-green-100 bg-green-50 p-3">
          <p className="flex items-center gap-1.5 text-sm text-green-700">
            <CircleCheck size={16} aria-hidden />
            Feedback recorded · {formatClock(feedbackMedia.durationSeconds)} ·{' '}
            {feedbackMedia.mode === 'video_audio' ? 'Video + audio' : 'Audio only'}
          </p>
          <Button variant="secondary" size="sm" onClick={session.requestRetake}>
            <RotateCcw aria-hidden />
            Retake
          </Button>
        </div>
      ) : (
        <>
          {feedbackMode === 'video_audio' ? (
            <CameraViewfinder
              stream={media.stream}
              streamStatus={media.status}
              recorderStatus={recorder.status}
              isMaskEnabled={isFaceMasked}
              countdownSeconds={countdown.remainingSeconds}
            />
          ) : (
            <div className="relative flex aspect-[3/1] flex-col items-center justify-center gap-3 rounded-lg bg-brand-50">
              <Mic size={28} aria-hidden className="text-brand-600" />
              <AudioLevelMeter level={session.audioLevel} />
              <CountdownOverlay remainingSeconds={countdown.remainingSeconds} />
            </div>
          )}
          <RecordingControls
            recorderStatus={recorder.status}
            isCountingDown={countdown.remainingSeconds !== null}
            isReady={session.isReady && isMediaRecorderSupported()}
            elapsedSeconds={recorder.elapsedSeconds}
            maxSeconds={FEEDBACK_MAX_SECONDS}
            warningSeconds={FEEDBACK_WARNING_SECONDS}
            audioLevel={session.audioLevel}
            onStart={session.start}
            onPause={recorder.pause}
            onResume={recorder.resume}
            onStop={recorder.stop}
            onRetake={session.requestRetake}
          />
        </>
      )}

      {session.isRetakeDialogOpen && (
        <ConfirmDialog
          title="Discard this feedback?"
          description="Your recording will be deleted so you can record again."
          confirmLabel="Discard and retake"
          cancelLabel="Keep it"
          onConfirm={session.confirmRetake}
          onCancel={session.cancelRetake}
        />
      )}
    </SectionCard>
  )
}
