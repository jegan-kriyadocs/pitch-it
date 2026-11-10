import { TextLink } from '@/ui/TextLink'

const CURRENT_YEAR = new Date().getFullYear()
const PRIVACY_POLICY_URL = 'https://www.kriyadocs.com/privacy-policy'
const TERMS_OF_USE_URL = 'https://www.kriyadocs.com/terms-of-use'

export function AuthFooter() {
  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-xs text-muted xs:px-8">
      <span>© {CURRENT_YEAR} Kriyadocs</span>
      <TextLink to={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" variant="muted">
        Privacy policy
      </TextLink>
      <TextLink to={TERMS_OF_USE_URL} target="_blank" rel="noopener noreferrer" variant="muted">
        Terms of use
      </TextLink>
    </footer>
  )
}
