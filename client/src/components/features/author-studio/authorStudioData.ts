import type { ManuscriptSession, PitchTemplate, TemplateId } from '@/types/authorStudio'

export const MANUSCRIPT_SESSION: ManuscriptSession = {
  manuscriptId: 'BMJ-2026-08912',
  journalName: 'BMJ Open',
  shortTitle: 'Adaptive Immunotherapy in Refractory Pancreatic Cancer',
  doiPreview: '10.1136/bmjopen-2026-08912',
  reviewPolicy: 'double_blind',
  targetDurationSeconds: 120,
  maxDurationSeconds: 180,
}

export const WARNING_THRESHOLD_SECONDS = 165
export const COUNTDOWN_SECONDS = 3
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024
export const MAX_UPLOAD_DURATION_SECONDS = 240
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

const CLINICAL_TRIAL: PitchTemplate = {
  id: 'clinical_trial',
  label: 'Clinical Trial Protocol & Findings',
  slides: [
    {
      pageNumber: 1,
      title: 'The Clinical Gap & Unmet Need',
      points: ['Median survival under 6 months', 'Gemcitabine response rate below 10%'],
      notes: ['Highlight why traditional chemo failed this cohort', 'Keep it under 30 seconds'],
      script:
        'Patients with refractory pancreatic cancer have almost no options left. Standard chemotherapy helps fewer than one in ten of them.',
    },
    {
      pageNumber: 2,
      title: 'Novel Methodology & Regimen',
      points: ['Adaptive dosing guided by ctDNA', 'Phase II, 142 refractory patients'],
      notes: ['Explain adaptive dosing in one sentence', 'Mention the 12-centre design'],
      script:
        'We evaluated 142 refractory patients across twelve centres, adjusting the immunotherapy dose every cycle based on circulating tumour DNA.',
    },
    {
      pageNumber: 3,
      title: 'Primary Findings & Statistical Proof',
      points: ['Overall survival +4.1 months', 'Hazard ratio 0.62, p < 0.001'],
      notes: ['Emphasize the Phase II p-value (p < 0.001)', 'Name the primary endpoint clearly'],
      script:
        'Overall survival improved by 4.1 months, with a hazard ratio of 0.62 and a p-value below 0.001.',
    },
    {
      pageNumber: 4,
      title: 'Real-World Significance & Triage Pitch',
      points: ['First adaptive protocol for this cohort', 'Ready for a Phase III trial'],
      notes: ['Say why this matters to clinicians now', 'Close with one memorable sentence'],
      script:
        'This is the first adaptive protocol shown to extend survival in this cohort, and it is ready for a Phase III trial.',
    },
  ],
}

function createTemplate(id: TemplateId, label: string, titles: string[]): PitchTemplate {
  return {
    id,
    label,
    slides: CLINICAL_TRIAL.slides.map((slide, index) => ({
      ...slide,
      title: titles[index] ?? slide.title,
    })),
  }
}

export const PITCH_TEMPLATES: PitchTemplate[] = [
  CLINICAL_TRIAL,
  createTemplate('basic_science', 'Basic Science / Lab Bench Discovery', [
    'The Open Question',
    'Experimental Approach',
    'Key Observations & Data',
    'Why the Discovery Matters',
  ]),
  createTemplate('systematic_review', 'Systematic Review & Meta-Analysis', [
    'The Evidence Gap',
    'Search Strategy & Inclusion Criteria',
    'Pooled Effect & Heterogeneity',
    'Implications for Practice',
  ]),
  createTemplate('case_study', 'Case Study & Surgical Protocol', [
    'Clinical Presentation',
    'Surgical Approach',
    'Outcome & Follow-up',
    'Lessons for Practice',
  ]),
]

export const TEMPLATE_OPTIONS = PITCH_TEMPLATES.map((template) => ({
  value: template.id,
  label: template.label,
}))

export function findTemplate(templateId: TemplateId): PitchTemplate {
  return PITCH_TEMPLATES.find((template) => template.id === templateId) ?? CLINICAL_TRIAL
}
