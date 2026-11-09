import { useCallback, useState } from 'react'

import { FEEDBACK_MAX_SECONDS } from '@/features/reviewer-feedback/reviewerFeedbackData'
import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'
import { useAudioLevel } from './useAudioLevel'
import { useCountdown } from './useCountdown'
import { useMediaRecorder, type CompletedRecording } from './useMediaRecorder'
import { useMediaStream } from './useMediaStream'

const COUNTDOWN_SECONDS = 3

export function useReviewerRecorder() {
  const feedbackMode = useReviewerFeedbackStore((state) => state.feedbackMode)
  const feedbackMedia = useReviewerFeedbackStore((state) => state.feedbackMedia)
  const submissionStatus = useReviewerFeedbackStore((state) => state.submissionStatus)
  const setFeedbackMedia = useReviewerFeedbackStore((state) => state.setFeedbackMedia)
  const clearFeedbackMedia = useReviewerFeedbackStore((state) => state.clearFeedbackMedia)
  const [isRetakeDialogOpen, setIsRetakeDialogOpen] = useState(false)

  const media = useMediaStream({
    isEnabled: feedbackMedia === null && submissionStatus === 'drafting',
    cameraId: '',
    microphoneId: '',
    includeVideo: feedbackMode === 'video_audio',
  })
  const audioLevel = useAudioLevel(media.stream)

  const handleComplete = useCallback(
    ({ blob, durationSeconds }: CompletedRecording) =>
      setFeedbackMedia({ blob, url: URL.createObjectURL(blob), durationSeconds, mode: feedbackMode }),
    [setFeedbackMedia, feedbackMode],
  )
  const recorder = useMediaRecorder(media.stream, {
    maxDurationSeconds: FEEDBACK_MAX_SECONDS,
    onComplete: handleComplete,
  })
  const countdown = useCountdown(COUNTDOWN_SECONDS, recorder.start)
  const isBusy = recorder.status !== 'inactive' || countdown.remainingSeconds !== null

  function confirmRetake() {
    setIsRetakeDialogOpen(false)
    countdown.cancel()
    if (recorder.status !== 'inactive') {
      recorder.discard()
      return
    }
    recorder.reset()
    clearFeedbackMedia()
  }

  return {
    media,
    audioLevel,
    recorder,
    countdown,
    feedbackMedia,
    isBusy,
    isReady: media.stream !== null && !isBusy,
    isRetakeDialogOpen,
    start: countdown.start,
    requestRetake: () => setIsRetakeDialogOpen(true),
    cancelRetake: () => setIsRetakeDialogOpen(false),
    confirmRetake,
  }
}
