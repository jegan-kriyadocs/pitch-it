import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layout/AppLayout'
import { AuthorPostAcceptanceStudioPage } from '@/pages/AuthorPostAcceptanceStudioPage'
import { AuthorSubmissionStudioPage } from '@/pages/AuthorSubmissionStudioPage'
import { EditorCongratulatoryStudioPage } from '@/pages/EditorCongratulatoryStudioPage'
import { EditorTriageDashboardPage } from '@/pages/EditorTriageDashboardPage'
import { PublishedArticleShowcasePage } from '@/pages/PublishedArticleShowcasePage'
import { ReviewerEvaluationStudioPage } from '@/pages/ReviewerEvaluationStudioPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/author-studio" replace />} />
        <Route path="/author-studio" element={<AuthorSubmissionStudioPage />} />
        <Route path="/editor-triage" element={<EditorTriageDashboardPage />} />
        <Route path="/reviewer-feedback" element={<ReviewerEvaluationStudioPage />} />
        <Route path="/editor-congratulations" element={<EditorCongratulatoryStudioPage />} />
        <Route path="/author-acceptance" element={<AuthorPostAcceptanceStudioPage />} />
        <Route path="/published-preview" element={<PublishedArticleShowcasePage />} />
      </Route>
    </Routes>
  )
}
