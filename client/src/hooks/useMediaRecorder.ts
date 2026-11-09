import { useCallback, useEffect, useRef, useState } from 'react'

import { clearRecording, saveRecordingChunk } from '@/lib/storage'

const TIMESLICE_MS = 1000
const TICK_MS = 200
const PREFERRED_MIME_TYPES = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4']

export type RecorderStatus = 'inactive' | 'recording' | 'paused'

export interface CompletedRecording {
  blob: Blob
  durationSeconds: number
}

interface UseMediaRecorderOptions {
  maxDurationSeconds: number
  onComplete: (recording: CompletedRecording) => void
}

function pickMimeType() {
  return PREFERRED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? ''
}

export const isMediaRecorderSupported = () => typeof MediaRecorder !== 'undefined'

export function useMediaRecorder(stream: MediaStream | null, options: UseMediaRecorderOptions) {
  const { maxDurationSeconds, onComplete } = options
  const [status, setStatus] = useState<RecorderStatus>('inactive')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const elapsedMsRef = useRef(0)
  const lastTickRef = useRef(0)
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve())
  const onCompleteRef = useRef(onComplete)
  const isUnmountedRef = useRef(false)
  const isDiscardingRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const stop = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [])

  useEffect(() => {
    if (status !== 'recording') {
      return
    }
    lastTickRef.current = performance.now()
    const intervalId = window.setInterval(() => {
      const now = performance.now()
      elapsedMsRef.current += now - lastTickRef.current
      lastTickRef.current = now
      const seconds = elapsedMsRef.current / 1000
      setElapsedSeconds(seconds)
      if (seconds >= maxDurationSeconds) {
        stop()
      }
    }, TICK_MS)
    return () => window.clearInterval(intervalId)
  }, [status, maxDurationSeconds, stop])

  useEffect(() => {
    isUnmountedRef.current = false
    return () => {
      isUnmountedRef.current = true
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop()
      }
    }
  }, [])

  function queueClearRecording() {
    saveQueueRef.current = saveQueueRef.current.then(() => clearRecording())
  }

  function start() {
    if (!stream || !isMediaRecorderSupported()) {
      return
    }
    queueClearRecording()
    const mimeType = pickMimeType()
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    chunksRef.current = []
    elapsedMsRef.current = 0
    setElapsedSeconds(0)

    recorder.ondataavailable = (event) => {
      if (event.data.size === 0 || isDiscardingRef.current) {
        return
      }
      chunksRef.current.push(event.data)
      const meta = { mimeType: recorder.mimeType, durationSeconds: elapsedMsRef.current / 1000 }
      saveQueueRef.current = saveQueueRef.current
        .then(() => saveRecordingChunk(event.data, meta))
        .catch(() => undefined)
    }
    recorder.onstop = () => {
      setStatus('inactive')
      recorderRef.current = null
      if (isUnmountedRef.current || isDiscardingRef.current) {
        isDiscardingRef.current = false
        return
      }
      onCompleteRef.current({
        blob: new Blob(chunksRef.current, { type: recorder.mimeType }),
        durationSeconds: elapsedMsRef.current / 1000,
      })
    }

    recorder.start(TIMESLICE_MS)
    recorderRef.current = recorder
    setStatus('recording')
  }

  function pause() {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.pause()
      setStatus('paused')
    }
  }

  function resume() {
    if (recorderRef.current?.state === 'paused') {
      recorderRef.current.resume()
      setStatus('recording')
    }
  }

  function reset() {
    chunksRef.current = []
    elapsedMsRef.current = 0
    setElapsedSeconds(0)
    queueClearRecording()
  }

  function discard() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      isDiscardingRef.current = true
      recorder.stop()
    }
    reset()
  }

  return { status, elapsedSeconds, start, pause, resume, stop, reset, discard }
}
