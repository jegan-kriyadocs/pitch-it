import { useEffect, useRef, useState } from 'react'

const GENERATION_DELAY_MS = 2000

export function useScriptAssist(onGenerated: () => void) {
  const [isGenerating, setIsGenerating] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function generateScript() {
    if (isGenerating) {
      return
    }
    setIsGenerating(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsGenerating(false)
      timeoutRef.current = null
      onGenerated()
    }, GENERATION_DELAY_MS)
  }

  return { isGenerating, generateScript }
}
