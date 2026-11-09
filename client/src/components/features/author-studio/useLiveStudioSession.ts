import { useCallback, useEffect, useState } from 'react'

import { useAudioLevel } from '@/hooks/useAudioLevel'
import { useCountdown } from '@/hooks/useCountdown'
import { useMediaDevices } from '@/hooks/useMediaDevices'
import { useMediaRecorder, type CompletedRecording } from '@/hooks/useMediaRecorder'
import { useMediaStream } from '@/hooks/useMediaStream'
import { COUNTDOWN_SECONDS, MANUSCRIPT_SESSION } from './authorStudioData'
import { isStudioLocked } from './authorStudioRules'
import { useAuthorStudioStore } from './authorStudioStore'

export function useLiveStudioSession() {
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const pitchVideo = useAuthorStudioStore((state) => state.pitchVideo)
  const setRecordingState = useAuthorStudioStore((state) => state.setRecordingState)
  const setPitchVideo = useAuthorStudioStore((state) => state.setPitchVideo)
  const clearPitchVideo = useAuthorStudioStore((state) => state.clearPitchVideo)
  const goToSlide = useAuthorStudioStore((state) => state.goToSlide)
  const [cameraId, setCameraId] = useState('')
  const [microphoneId, setMicrophoneId] = useState('')
  const [isRetakeDialogOpen, setIsRetakeDialogOpen] = useState(false)
  const [shouldResumeAfterRetake, setShouldResumeAfterRetake] = useState(false)

  const recordedVideo = pitchVideo?.source === 'live_record' ? pitchVideo : null
  const isStreamEnabled =
    !recordedVideo && recordingState !== 'uploading' && recordingState !== 'success'
  const media = useMediaStream({ isEnabled: isStreamEnabled, cameraId, microphoneId })
  const devices = useMediaDevices(media.status)
  const audioLevel = useAudioLevel(media.stream)

  const handleComplete = useCallback(
    ({ blob, durationSeconds }: CompletedRecording) =>
      setPitchVideo({ blob, url: URL.createObjectURL(blob), durationSeconds, source: 'live_record' }),
    [setPitchVideo],
  )
  const recorder = useMediaRecorder(media.stream, {
    maxDurationSeconds: MANUSCRIPT_SESSION.maxDurationSeconds,
    onComplete: handleComplete,
  })
  const countdown = useCountdown(COUNTDOWN_SECONDS, () => {
    recorder.start()
    setRecordingState('recording')
  })

  useEffect(() => {
    if (recordingState === 'idle' && media.status === 'requesting') {
      setRecordingState('preflight')
    } else if (recordingState === 'preflight' && media.status !== 'requesting') {
      setRecordingState('idle')
    }
  }, [recordingState, media.status, setRecordingState])

  function startRecording() {
    goToSlide(0)
    setRecordingState('countdown')
    countdown.start()
  }

  function pauseRecording() {
    recorder.pause()
    setRecordingState('paused')
  }

  function resumeRecording() {
    recorder.resume()
    setRecordingState('recording')
  }

  function requestRetake() {
    const isRecording = recorder.status === 'recording'
    if (isRecording) {
      pauseRecording()
    }
    setShouldResumeAfterRetake(isRecording)
    setIsRetakeDialogOpen(true)
  }

  function cancelRetake() {
    setIsRetakeDialogOpen(false)
    if (shouldResumeAfterRetake) {
      resumeRecording()
    }
    setShouldResumeAfterRetake(false)
  }

  function confirmRetake() {
    setIsRetakeDialogOpen(false)
    setShouldResumeAfterRetake(false)
    countdown.cancel()
    if (recorder.status !== 'inactive') {
      recorder.discard()
      setRecordingState(pitchVideo ? 'reviewing' : 'idle')
      return
    }
    recorder.reset()
    clearPitchVideo()
  }

  return {
    media,
    devices,
    audioLevel,
    recorder,
    countdown,
    recordedVideo,
    isLocked: isStudioLocked(recordingState),
    isReady: media.stream !== null && !isStudioLocked(recordingState),
    deviceSelection: { cameraId, microphoneId, setCameraId, setMicrophoneId },
    isRetakeDialogOpen,
    actions: {
      startRecording,
      pauseRecording,
      resumeRecording,
      stopRecording: recorder.stop,
      requestRetake,
      cancelRetake,
      confirmRetake,
    },
  }
}
