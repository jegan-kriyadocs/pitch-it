import { useEffect, useState } from 'react'

import { getSharedAudioContext } from '@/lib/audioContext'

const UPDATE_INTERVAL_MS = 80
const LEVEL_GAIN = 4

export function useAudioLevel(stream: MediaStream | null) {
  const [level, setLevel] = useState(0)

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setLevel(0)
      return
    }
    const audioContext = getSharedAudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    const samples = new Uint8Array(analyser.fftSize)
    let frameId = 0
    let lastUpdate = 0

    const measure = (timeMs: number) => {
      if (timeMs - lastUpdate >= UPDATE_INTERVAL_MS) {
        analyser.getByteTimeDomainData(samples)
        const sumOfSquares = samples.reduce((sum, sample) => {
          const centered = (sample - 128) / 128
          return sum + centered * centered
        }, 0)
        setLevel(Math.min(1, Math.sqrt(sumOfSquares / samples.length) * LEVEL_GAIN))
        lastUpdate = timeMs
      }
      frameId = requestAnimationFrame(measure)
    }
    frameId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(frameId)
      source.disconnect()
      analyser.disconnect()
    }
  }, [stream])

  return level
}
