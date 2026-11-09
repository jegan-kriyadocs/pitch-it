import {
  BadgeCheck,
  ListChecks,
  MessageSquareText,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  PartyPopper,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/author-studio', label: 'Author Studio', icon: Video },
  { to: '/editor-triage', label: 'Editor Triage', icon: ListChecks },
  { to: '/reviewer-feedback', label: 'Reviewer Feedback', icon: MessageSquareText },
  { to: '/editor-congratulations', label: 'Editor Congratulations', icon: PartyPopper },
  { to: '/author-acceptance', label: 'Author Acceptance', icon: BadgeCheck },
  { to: '/published-preview', label: 'Published Preview', icon: Newspaper },
]

const PREFERENCE_STORAGE_KEY = 'pitchIt.sideNavPreference'
const NARROW_QUERY = '(max-width: 1299px)'

function readPreference() {
  try {
    const stored = localStorage.getItem(PREFERENCE_STORAGE_KEY)
    return stored === null ? null : stored === 'true'
  } catch {
    return null
  }
}

interface NavItemLinkProps {
  item: NavItem
  isCollapsed: boolean
}

function NavItemLink({ item, isCollapsed }: NavItemLinkProps) {
  const { to, label, icon: Icon } = item

  return (
    <NavLink
      to={to}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex h-10 items-center gap-2.5 rounded-base px-2.5 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand-600',
          isActive
            ? 'bg-brand-50 font-semibold text-brand-700'
            : 'font-medium text-body hover:bg-gray-50 hover:text-heading',
          isCollapsed && 'md:justify-center md:px-0',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            aria-hidden
            className={cn('shrink-0', isActive ? 'text-brand-600' : 'text-gray-400')}
          />
          <span className={cn('flex-1', isCollapsed && 'md:sr-only')}>{label}</span>
        </>
      )}
    </NavLink>
  )
}

interface CollapseButtonProps {
  isCollapsed: boolean
  onToggle: () => void
}

function CollapseButton({ isCollapsed, onToggle }: CollapseButtonProps) {
  const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <button
      type="button"
      aria-expanded={!isCollapsed}
      onClick={onToggle}
      className={cn(
        'mt-auto hidden h-9 cursor-pointer items-center gap-2.5 rounded-base px-2.5 text-[13px] text-muted hover:bg-gray-50 hover:text-heading focus-visible:outline-2 focus-visible:outline-brand-600 md:mx-3 md:flex',
        isCollapsed && 'md:justify-center md:px-0',
      )}
    >
      <Icon size={17} aria-hidden className="shrink-0" />
      <span className={cn(isCollapsed && 'sr-only')}>
        {isCollapsed ? 'Expand navigation' : 'Collapse'}
      </span>
    </button>
  )
}

export function SideNav() {
  const isNarrow = useMediaQuery(NARROW_QUERY)
  const [preference, setPreference] = useState(readPreference)
  const isCollapsed = preference ?? isNarrow

  useEffect(() => {
    if (preference === null) {
      return
    }
    try {
      localStorage.setItem(PREFERENCE_STORAGE_KEY, String(preference))
    } catch {
      return
    }
  }, [preference])

  return (
    <nav
      aria-label="Main"
      className={cn(
        'flex shrink-0 border-b border-border bg-white md:flex-col md:border-r md:border-b-0 md:pt-[18px] md:pb-3',
        isCollapsed ? 'md:w-17' : 'md:w-58',
      )}
    >
      {!isCollapsed && (
        <p className="hidden px-6 pb-2.5 text-[11px] leading-[normal] font-semibold tracking-[0.06em] text-muted uppercase md:block">
          Pitch It
        </p>
      )}
      <ul className="flex flex-1 gap-1 overflow-x-auto px-4 py-2.5 md:flex-none md:flex-col md:gap-0.5 md:px-3 md:py-0">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavItemLink item={item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
      <CollapseButton isCollapsed={isCollapsed} onToggle={() => setPreference(!isCollapsed)} />
    </nav>
  )
}
