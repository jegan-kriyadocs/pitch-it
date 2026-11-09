import { Outlet } from 'react-router-dom'

import { ToastViewport } from '@/ui/ToastViewport'
import { AppHeader } from './AppHeader'
import { SideNav } from './SideNav'

export function AppLayout() {
  return (
    <div className="flex h-dvh flex-col bg-page">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SideNav />
        <main
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-y-auto px-5 pt-6 pb-12 outline-hidden sm:px-6 xl:px-10 xl:pt-8 xl:pb-14"
        >
          <div className="mx-auto w-full max-w-[1360px]">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
