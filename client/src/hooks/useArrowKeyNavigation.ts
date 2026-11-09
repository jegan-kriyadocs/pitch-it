import { useEffect } from 'react'

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]'

export function useArrowKeyNavigation(onPrevious: () => void, onNext: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof Element && target.closest(EDITABLE_SELECTOR)) {
        return
      }
      if (document.querySelector('dialog[open]')) {
        return
      }
      if (event.key === 'ArrowLeft') {
        onPrevious()
      } else if (event.key === 'ArrowRight') {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrevious, onNext])
}
