import { useEffect, useRef, useState } from 'react'

const WORD_INTERVAL_MS = 160

export function useDictationSimulation(onWord: (word: string) => void) {
  const [isDictating, setIsDictating] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const onWordRef = useRef(onWord)

  useEffect(() => {
    onWordRef.current = onWord
  }, [onWord])

  function stop() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsDictating(false)
  }

  useEffect(() => stop, [])

  function start(text: string) {
    stop()
    const words = text.split(' ')
    let wordIndex = 0
    setIsDictating(true)
    intervalRef.current = window.setInterval(() => {
      const word = words[wordIndex]
      if (word === undefined) {
        stop()
        return
      }
      onWordRef.current(word)
      wordIndex += 1
    }, WORD_INTERVAL_MS)
  }

  return { isDictating, start, stop }
}
