import kriyadocsLogo from '@/assets/kriyadocs-logo.png'
import { AuthFooter } from '@/features/auth/AuthFooter'
import { AuthHeroPanel } from '@/features/auth/AuthHeroPanel'
import { DemoPersonaSelector } from '@/features/auth/DemoPersonaSelector'
import { LoginForm } from '@/features/auth/LoginForm'
import { useLoginForm } from '@/features/auth/useLoginForm'
import { Card } from '@/ui/Card'

export function LoginPage() {
  const form = useLoginForm()

  return (
    <div className="flex min-h-dvh bg-page">
      <title>Sign in · Pitch It</title>
      <AuthHeroPanel />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 xs:px-8">
          <Card raised className="flex w-full max-w-[460px] flex-col gap-6 px-5 pt-7 pb-6 xs:px-9 xs:pt-9 xs:pb-8">
            <div className="flex flex-col items-center gap-5 text-center">
              <img src={kriyadocsLogo} alt="Kriyadocs" className="h-10 w-auto" />
              <div className="flex flex-col gap-1.5">
                <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-heading">Sign in to Pitch It</h1>
                <p className="text-sm text-body">
                  Select your role or enter your credentials to access your workspace.
                </p>
              </div>
            </div>
            <DemoPersonaSelector selectedRole={form.selectedRole} onSelectEmail={form.selectPersonaEmail} />
            <LoginForm form={form} />
          </Card>
          <p className="mt-5 max-w-[460px] text-center text-[13px] text-body">
            Need an account? Inquiries should be routed to your journal managing editor.
          </p>
        </main>
        <AuthFooter />
      </div>
    </div>
  )
}
