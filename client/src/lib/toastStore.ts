import { create } from 'zustand'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

let nextToastId = 1

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = nextToastId
    nextToastId += 1
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

export const showToast = (toast: Omit<Toast, 'id'>) => useToastStore.getState().showToast(toast)
