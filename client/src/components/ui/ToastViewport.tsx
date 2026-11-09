import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { useEffect } from 'react'

import { cn } from '@/lib/cn'
import { useToastStore, type Toast, type ToastVariant } from '@/lib/toastStore'

const AUTO_DISMISS_MS = 4500

const VARIANT_ICONS: Record<ToastVariant, LucideIcon> = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  error: CircleAlert,
}

const VARIANT_ICON_CLASSES: Record<ToastVariant, string> = {
  success: 'text-emerald-600',
  info: 'text-brand-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const Icon = VARIANT_ICONS[toast.variant]

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timeoutId)
  }, [toast.id, onDismiss])

  return (
    <li className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-white p-4 shadow-menu motion-safe:animate-toast-in sm:w-[360px]">
      <Icon size={18} aria-hidden className={cn('mt-px shrink-0', VARIANT_ICON_CLASSES[toast.variant])} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-heading">{toast.title}</p>
        {toast.description && <p className="text-[13px] text-body">{toast.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="-mt-1 -mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-base text-gray-400 hover:bg-gray-100 hover:text-heading focus-visible:outline-2 focus-visible:outline-brand-600"
      >
        <X size={15} aria-hidden />
      </button>
    </li>
  )
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismissToast = useToastStore((state) => state.dismissToast)

  return (
    <ol
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 bottom-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </ol>
  )
}
