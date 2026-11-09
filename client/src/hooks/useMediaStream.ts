import { useEffect, useState } from 'react'

import {
  createSimulatedMediaStream,
  isSimulatedStreamSupported,
  type ManagedMediaStream,
} from '@/lib/simulatedMediaStream'

export type MediaStreamStatus = 'idle' | 'requesting' | 'live' | 'simulated' | 'unavailable'

interface MediaStreamResult {
  stream: MediaStream | null
  status: MediaStreamStatus
  fallbackReason: string | null
}

interface UseMediaStreamOptions {
  isEnabled: boolean
  cameraId: string
  microphoneId: string
  includeVideo?: boolean
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

function simulateOrGiveUp(includeVideo: boolean, fallbackReason: string) {
  if (!isSimulatedStreamSupported(includeVideo)) {
    return { managed: null, fallbackReason }
  }
  try {
    return { managed: createSimulatedMediaStream({ includeVideo }), fallbackReason }
  } catch {
    return { managed: null, fallbackReason }
  }
}

async function acquireStream(cameraId: string, microphoneId: string, includeVideo: boolean) {
  if (!navigator.mediaDevices?.getUserMedia) {
    return simulateOrGiveUp(includeVideo, 'This browser cannot use a camera.')
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: includeVideo ? (cameraId ? { deviceId: { exact: cameraId } } : { width: 1280, height: 720 }) : false,
      audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
    })
    const managed: ManagedMediaStream = {
      stream,
      stop: () => stream.getTracks().forEach((track) => track.stop()),
    }
    return { managed, fallbackReason: null }
  } catch (error) {
    return simulateOrGiveUp(includeVideo, describeMediaError(error))
  }
}

export function useMediaStream({ isEnabled, cameraId, microphoneId, includeVideo = true }: UseMediaStreamOptions) {
  const [result, setResult] = useState<MediaStreamResult>(IDLE_RESULT)

  useEffect(() => {
    if (!isEnabled) {
      setResult(IDLE_RESULT)
      return
    }
    let isActive = true
    let acquired: ManagedMediaStream | null = null
    setResult({ stream: null, status: 'requesting', fallbackReason: null })

    void acquireStream(cameraId, microphoneId, includeVideo).then(({ managed, fallbackReason }) => {
      if (!isActive) {
        managed?.stop()
        return
      }
      if (!managed) {
        setResult({ stream: null, status: 'unavailable', fallbackReason })
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
  }, [isEnabled, cameraId, microphoneId, includeVideo])

  return result
}
