import { X } from 'lucide-react'
import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

type DialogSize = 'md' | 'lg' | 'xl'

const SIZE_CLASSES: Record<DialogSize, string> = {
  md: 'max-w-[540px]',
  lg: 'max-w-[640px]',
  xl: 'max-w-[1000px]',
}

interface DialogProps {
  title: string
  description?: ReactNode
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  canClose?: boolean
  size?: DialogSize
}

export function Dialog({
  title,
  description,
  onClose,
  children,
  footer,
  canClose = true,
  size = 'md',
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isUnmountingRef = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    isUnmountingRef.current = false
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      isUnmountingRef.current = true
      dialog?.close()
      const returnTo = opener?.isConnected ? opener : document.querySelector('main')
      returnTo?.focus()
    }
  }, [])

  function handleBrowserClose() {
    if (isUnmountingRef.current || dialogRef.current?.open) {
      return
    }
    if (canClose) {
      onClose()
    } else {
      dialogRef.current?.showModal()
    }
  }

  function requestClose() {
    if (canClose) {
      onClose()
    }
  }

  function closeOnBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      requestClose()
    }
  }

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClick={closeOnBackdropClick}
      onClose={handleBrowserClose}
      className={cn(
        'm-auto max-h-[92%] w-[calc(100%-1rem)] flex-col overflow-hidden rounded-lg bg-white p-0 shadow-dialog backdrop:bg-gray-900/40 open:flex',
        SIZE_CLASSES[size],
      )}
    >
      <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 pt-5 pb-4 sm:px-7">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 id={titleId} className="text-lg leading-[normal] font-semibold text-heading">
            {title}
          </h2>
          {description && (
            <div id={descriptionId} className="text-[13px] leading-[normal] text-body">
              {description}
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={!canClose}
          className="-mt-1.5 -mr-2 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-base text-gray-400 hover:bg-gray-100 hover:text-heading focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
      {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>}
      {footer && (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 border-t border-border px-5 py-4 sm:px-7">
          {footer}
        </div>
      )}
    </dialog>
  )
}
