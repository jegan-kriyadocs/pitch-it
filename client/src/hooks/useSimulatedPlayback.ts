import { useEffect, useState } from 'react'

const MIN_UPDATE_MS = 60

export type SimulatedPlayback = ReturnType<typeof useSimulatedPlayback>

export function useSimulatedPlayback(durationSeconds: number) {
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    if (!isPlaying) {
      return
    }
    let frameId = 0
    let lastTime = performance.now()
    let pendingSeconds = 0

    const step = (time: number) => {
      pendingSeconds += ((time - lastTime) / 1000) * playbackRate
      lastTime = time
      if (pendingSeconds * 1000 >= MIN_UPDATE_MS) {
        const delta = pendingSeconds
        pendingSeconds = 0
        setCurrentSeconds((current) => Math.min(durationSeconds, current + delta))
      }
      frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying, playbackRate, durationSeconds])

  useEffect(() => {
    if (isPlaying && currentSeconds >= durationSeconds) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentSeconds, durationSeconds])

  function play() {
    if (durationSeconds <= 0) {
      return
    }
    if (currentSeconds >= durationSeconds) {
      setCurrentSeconds(0)
    }
    setIsPlaying(true)
  }

  function seek(seconds: number) {
    setCurrentSeconds(Math.min(Math.max(0, seconds), durationSeconds))
  }

  return {
    currentSeconds,
    isPlaying,
    playbackRate,
    play,
    pause: () => setIsPlaying(false),
    togglePlay: () => (isPlaying ? setIsPlaying(false) : play()),
    seek,
    setPlaybackRate,
  }
}
