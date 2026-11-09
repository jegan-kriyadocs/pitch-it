import { useReviewerFeedbackStore } from '@/features/reviewer-feedback/reviewerFeedbackStore'

let nextAnnotationId = 1

export function useTimestampAnnotations() {
  const annotations = useReviewerFeedbackStore((state) => state.annotations)
  const setAnnotations = useReviewerFeedbackStore((state) => state.setAnnotations)
  const sortedAnnotations = [...annotations].sort((first, second) => first.seconds - second.seconds)

  function addAnnotation(seconds: number, slideIndex: number, text: string) {
    const trimmedText = text.trim()
    if (!trimmedText) {
      return
    }
    const id = `pinned-${nextAnnotationId}`
    nextAnnotationId += 1
    setAnnotations([...annotations, { id, seconds: Math.round(seconds), slideIndex, text: trimmedText }])
  }

  function updateAnnotation(id: string, text: string) {
    setAnnotations(
      annotations.map((annotation) => (annotation.id === id ? { ...annotation, text: text.trim() } : annotation)),
    )
  }

  function removeAnnotation(id: string) {
    setAnnotations(annotations.filter((annotation) => annotation.id !== id))
  }

  return { annotations: sortedAnnotations, addAnnotation, updateAnnotation, removeAnnotation }
}
