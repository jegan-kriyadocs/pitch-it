import { useEffect, useState } from 'react'

import { createSimulatedMediaStream, type ManagedMediaStream } from '@/lib/simulatedMediaStream'

export type MediaStreamStatus = 'idle' | 'requesting' | 'live' | 'simulated'

interface MediaStreamResult {
  stream: MediaStream | null
  status: MediaStreamStatus
  fallbackReason: string | null
}

interface UseMediaStreamOptions {
  isEnabled: boolean
  cameraId: string
  microphoneId: string
}

const IDLE_RESULT: MediaStreamResult = { stream: null, status: 'idle', fallbackReason: null }

function describeMediaError(error: unknown) {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Camera or microphone access was blocked.'
  }
  if (error instanceof DOMException && error.name === 'NotFoundError') {
    return 'No camera or microphone was found.'
  }
  return 'Your camera or microphone is not available.'
}

async function acquireStream(cameraId: string, microphoneId: string) {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { managed: createSimulatedMediaStream(), fallbackReason: 'This browser cannot use a camera.' }
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: cameraId ? { deviceId: { exact: cameraId } } : { width: 1280, height: 720 },
      audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
    })
    const managed: ManagedMediaStream = {
      stream,
      stop: () => stream.getTracks().forEach((track) => track.stop()),
    }
    return { managed, fallbackReason: null }
  } catch (error) {
    return { managed: createSimulatedMediaStream(), fallbackReason: describeMediaError(error) }
  }
}

export function useMediaStream({ isEnabled, cameraId, microphoneId }: UseMediaStreamOptions) {
  const [result, setResult] = useState<MediaStreamResult>(IDLE_RESULT)

  useEffect(() => {
    if (!isEnabled) {
      setResult(IDLE_RESULT)
      return
    }
    let isActive = true
    let acquired: ManagedMediaStream | null = null
    setResult({ stream: null, status: 'requesting', fallbackReason: null })

    void acquireStream(cameraId, microphoneId).then(({ managed, fallbackReason }) => {
      if (!isActive) {
        managed.stop()
        return
      }
      acquired = managed
      setResult({
        stream: managed.stream,
        status: fallbackReason ? 'simulated' : 'live',
        fallbackReason,
      })
    })

    return () => {
      isActive = false
      acquired?.stop()
    }
  }, [isEnabled, cameraId, microphoneId])

  return result
}
