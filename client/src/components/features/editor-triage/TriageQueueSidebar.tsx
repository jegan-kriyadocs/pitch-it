import { Inbox, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'

import type { TriageQueue } from '@/hooks/useTriageQueue'
import { cn } from '@/lib/cn'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { SearchField } from '@/ui/SearchField'
import { SegmentedControl } from '@/ui/SegmentedControl'
import type { QueueFilter } from './editorTriageRules'
import { TriageQueueItem } from './TriageQueueItem'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'decided', label: 'Decided' },
] as const

interface TriageQueueSidebarProps {
  queue: TriageQueue
}

export function TriageQueueSidebar({ queue }: TriageQueueSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const CollapseIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <Card className={cn('flex w-full shrink-0 flex-col gap-3 p-4 lg:sticky lg:top-0', isCollapsed ? 'lg:w-auto' : 'lg:w-80')}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={cn('flex items-center gap-2 text-base font-semibold text-heading', isCollapsed && 'lg:sr-only')}>
          Triage queue
          <span className="rounded-full bg-brand-50 px-2 py-px text-xs text-brand-700">
            {queue.counts.pending} pending
          </span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand queue' : 'Collapse queue'}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          <CollapseIcon aria-hidden />
        </Button>
      </div>

      <div className={cn('flex flex-col gap-3', isCollapsed && 'lg:hidden')}>
        <SearchField
          label="Search submissions"
          placeholder="Search ID, title or topic"
          value={queue.searchQuery}
          onChange={(event) => queue.setSearchQuery(event.target.value)}
        />
        <SegmentedControl<QueueFilter>
          label="Filter submissions"
          options={FILTER_OPTIONS}
          value={queue.filter}
          onChange={queue.setFilter}
        />
        {queue.visibleSubmissions.length === 0 ? (
          <p role="status" className="flex items-center gap-2 py-6 text-sm text-muted">
            <Inbox size={16} aria-hidden />
            No submissions match.
          </p>
        ) : (
          <ul aria-label="Submissions" className="flex flex-col gap-2 lg:max-h-[calc(100dvh-280px)] lg:overflow-y-auto">
            {queue.visibleSubmissions.map((submission) => (
              <li key={submission.manuscriptId}>
                <TriageQueueItem
                  submission={submission}
                  isSelected={submission.manuscriptId === queue.selectedId}
                  onSelect={queue.selectSubmission}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
