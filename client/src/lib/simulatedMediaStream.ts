import { getSharedAudioContext } from './audioContext'
import { drawPresenterFrame } from './presenterFrame'

const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 720
const FRAME_RATE = 30

export interface ManagedMediaStream {
  stream: MediaStream
  stop: () => void
}

function drawSimulatedFrame(context: CanvasRenderingContext2D, timeMs: number) {
  drawPresenterFrame(context, {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    timeMs,
    label: 'Simulated camera',
    isSpeaking: false,
  })
}

function createSimulatedAudioTrack() {
  if (typeof AudioContext === 'undefined') {
    return { track: undefined, stop: () => undefined }
  }
  const audioContext = getSharedAudioContext()
  const destination = audioContext.createMediaStreamDestination()
  const tone = audioContext.createOscillator()
  const toneGain = audioContext.createGain()
  const pulse = audioContext.createOscillator()
  const pulseDepth = audioContext.createGain()

  tone.frequency.value = 180
  toneGain.gain.value = 0.04
  pulse.frequency.value = 1.5
  pulseDepth.gain.value = 0.04
  pulse.connect(pulseDepth).connect(toneGain.gain)
  tone.connect(toneGain).connect(destination)
  tone.start()
  pulse.start()

  return {
    track: destination.stream.getAudioTracks()[0],
    stop: () => {
      tone.stop()
      pulse.stop()
      toneGain.disconnect()
      pulseDepth.disconnect()
    },
  }
}

interface SimulatedStreamOptions {
  includeVideo?: boolean
}

function isUsableStream(stream: unknown): stream is MediaStream {
  return (
    stream instanceof MediaStream &&
    typeof stream.getTracks === 'function' &&
    typeof stream.addTrack === 'function'
  )
}

export function isSimulatedStreamSupported(includeVideo: boolean) {
  if (typeof MediaStream === 'undefined') {
    return false
  }
  return !includeVideo || typeof HTMLCanvasElement.prototype.captureStream === 'function'
}

export function createSimulatedMediaStream({ includeVideo = true }: SimulatedStreamOptions = {}): ManagedMediaStream {
  const audio = createSimulatedAudioTrack()
  if (!includeVideo) {
    const stream = new MediaStream(audio.track ? [audio.track] : [])
    if (!isUsableStream(stream)) {
      audio.stop()
      throw new Error('MediaStream is not supported')
    }
    return {
      stream,
      stop: () => {
        stream.getTracks().forEach((track) => track.stop())
        audio.stop()
      },
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = FRAME_WIDTH
  canvas.height = FRAME_HEIGHT
  const context = canvas.getContext('2d')
  let frameId = 0

  const renderLoop = (timeMs: number) => {
    if (context) {
      drawSimulatedFrame(context, timeMs)
    }
    frameId = requestAnimationFrame(renderLoop)
  }
  frameId = requestAnimationFrame(renderLoop)

  const stream = canvas.captureStream(FRAME_RATE)
  if (!isUsableStream(stream)) {
    cancelAnimationFrame(frameId)
    audio.stop()
    throw new Error('Canvas capture is not supported')
  }
  if (audio.track) {
    stream.addTrack(audio.track)
  }

  return {
    stream,
    stop: () => {
      cancelAnimationFrame(frameId)
      stream.getTracks().forEach((track) => track.stop())
      audio.stop()
    },
  }
}
