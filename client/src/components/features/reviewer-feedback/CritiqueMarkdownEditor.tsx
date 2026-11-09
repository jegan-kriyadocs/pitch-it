import { ListPlus, Mic, MicOff, NotebookPen } from 'lucide-react'
import { useRef, useState } from 'react'

import { useDictationSimulation } from '@/hooks/useDictationSimulation'
import { formatClock } from '@/lib/formatTime'
import type { CritiqueField } from '@/types/reviewerFeedback'
import { Button } from '@/ui/Button'
import { SectionCard } from '@/ui/SectionCard'
import { SegmentedControl } from '@/ui/SegmentedControl'
import { TextAreaField } from '@/ui/TextAreaField'
import { MarkdownToolbar } from './MarkdownToolbar'
import { DICTATION_SAMPLE, MIN_AUTHOR_COMMENT_WORDS } from './reviewerFeedbackData'
import { countWords, insertMarkdown, type MarkdownSyntax } from './reviewerFeedbackRules'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

const FIELD_OPTIONS = [
  { value: 'commentsToAuthor', label: 'Comments for authors' },
  { value: 'confidentialCommentsToEditor', label: 'Confidential to editor' },
] as const

const FIELD_HINTS: Record<CritiqueField, string> = {
  commentsToAuthor: `Shared with the authors. Cover major and minor revisions (at least ${MIN_AUTHOR_COMMENT_WORDS} words).`,
  confidentialCommentsToEditor: 'Only the editor sees this. Optional.',
}

export function CritiqueMarkdownEditor() {
  const critique = useReviewerFeedbackStore((state) => state.critique)
  const annotations = useReviewerFeedbackStore((state) => state.annotations)
  const setCritique = useReviewerFeedbackStore((state) => state.setCritique)
  const [activeField, setActiveField] = useState<CritiqueField>('commentsToAuthor')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const dictation = useDictationSimulation((word) => {
    const current = useReviewerFeedbackStore.getState().critique[activeField]
    setCritique(activeField, current ? `${current} ${word}` : word)
  })
  const text = critique[activeField]

  function format(syntax: MarkdownSyntax) {
    const textArea = textAreaRef.current
    const result = insertMarkdown(text, textArea?.selectionStart ?? text.length, textArea?.selectionEnd ?? text.length, syntax)
    setCritique(activeField, result.text)
    requestAnimationFrame(() => {
      textArea?.focus()
      textArea?.setSelectionRange(result.cursor, result.cursor)
    })
  }

  function insertPinnedNotes() {
    const notes = [...annotations]
      .sort((first, second) => first.seconds - second.seconds)
      .map((annotation) => `- @ ${formatClock(annotation.seconds)}: ${annotation.text}`)
      .join('\n')
    setCritique('commentsToAuthor', [critique.commentsToAuthor, '### Notes on the pitch', notes].filter(Boolean).join('\n\n'))
    setActiveField('commentsToAuthor')
  }

  return (
    <SectionCard
      step={4}
      title="Write your critique"
      icon={NotebookPen}
      description="Markdown is supported. Dictate if typing is slow."
      actions={
        <Button
          variant={dictation.isDictating ? 'danger' : 'secondary'}
          size="sm"
          aria-pressed={dictation.isDictating}
          onClick={() => (dictation.isDictating ? dictation.stop() : dictation.start(DICTATION_SAMPLE))}
        >
          {dictation.isDictating ? <MicOff aria-hidden /> : <Mic aria-hidden />}
          {dictation.isDictating ? 'Stop dictation' : 'Dictate'}
        </Button>
      }
    >
      <SegmentedControl<CritiqueField>
        label="Critique section"
        options={FIELD_OPTIONS}
        value={activeField}
        isDisabled={dictation.isDictating}
        onChange={setActiveField}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MarkdownToolbar isDisabled={dictation.isDictating} onFormat={format} />
        {activeField === 'commentsToAuthor' && annotations.length > 0 && (
          <Button variant="ghost" size="sm" onClick={insertPinnedNotes} disabled={dictation.isDictating}>
            <ListPlus aria-hidden />
            Insert {annotations.length} pinned notes
          </Button>
        )}
      </div>
      <TextAreaField
        ref={textAreaRef}
        label={FIELD_OPTIONS.find((option) => option.value === activeField)?.label ?? ''}
        hint={FIELD_HINTS[activeField]}
        rows={9}
        value={text}
        readOnly={dictation.isDictating}
        onChange={(event) => setCritique(activeField, event.target.value)}
        className="[&_textarea]:font-mono [&_textarea]:text-[13px]"
      />
      <p role="status" className="text-right text-[13px] text-muted tabular-nums">
        {countWords(text)} words
      </p>
    </SectionCard>
  )
}
