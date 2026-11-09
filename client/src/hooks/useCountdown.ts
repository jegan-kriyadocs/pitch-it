import { useEffect, useRef, useState } from 'react'

export function useCountdown(durationSeconds: number, onComplete: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (remainingSeconds === null) {
      return
    }
    if (remainingSeconds === 0) {
      setRemainingSeconds(null)
      onCompleteRef.current()
      return
    }
    const timeoutId = window.setTimeout(() => setRemainingSeconds(remainingSeconds - 1), 1000)
    return () => window.clearTimeout(timeoutId)
  }, [remainingSeconds])

  return {
    remainingSeconds,
    start: () => setRemainingSeconds(durationSeconds),
    cancel: () => setRemainingSeconds(null),
  }
}
