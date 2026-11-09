import { Inbox } from 'lucide-react'

import { TriageQueueSidebar } from '@/features/editor-triage/TriageQueueSidebar'
import { TriageWorkspace } from '@/features/editor-triage/TriageWorkspace'
import { useTriageQueue } from '@/hooks/useTriageQueue'
import { Card } from '@/ui/Card'
import { EmptyState } from '@/ui/EmptyState'

export function EditorTriageDashboardPage() {
  const queue = useTriageQueue()
  const { selectedSubmission } = queue

  return (
    <div className="flex flex-col items-start gap-5 lg:flex-row">
      <TriageQueueSidebar queue={queue} />
      {selectedSubmission ? (
        <TriageWorkspace key={selectedSubmission.manuscriptId} submission={selectedSubmission} />
      ) : (
        <Card className="w-full flex-1 p-10">
          <EmptyState icon={Inbox} title="Select a submission" description="Choose a manuscript from the triage queue to watch its pitch." />
        </Card>
      )}
    </div>
  )
}
