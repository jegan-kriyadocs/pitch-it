import type {
  ReviewAssignment,
  RubricCriterion,
  RubricScores,
  TimestampAnnotation,
  TonePhrase,
} from '@/types/reviewerFeedback'

export const FEEDBACK_MAX_SECONDS = 90
export const FEEDBACK_WARNING_SECONDS = 75
export const MIN_AUTHOR_COMMENT_WORDS = 20

export const REVIEW_ASSIGNMENT: ReviewAssignment = {
  invitationToken: 'rev_tok_849102',
  manuscriptId: 'BMJ-2026-08912',
  journalName: 'BMJ Open',
  title: 'Phase III Trial of Dual Checkpoint Inhibitors in Refractory Lung Adenocarcinoma',
  reviewerPseudonym: 'Reviewer 2 — Biostatistician & Clinical Oncologist',
  reviewerOrcid: '0000-0001-7740-2210',
  deadlineIso: '2026-11-24T23:59:00Z',
  isDoubleBlind: true,
  pitch: {
    title: 'Dual checkpoint inhibition after progression on first-line therapy',
    durationSeconds: 128,
    slides: [
      { title: 'Hypothesis', points: ['Dual PD-1 + CTLA-4 blockade overcomes resistance', '612 patients, 41 centres'], startSeconds: 0 },
      { title: 'Kaplan-Meier Survival Curve', points: ['Median OS 14.2 vs 9.8 months', 'Curves separate at month 4'], startSeconds: 32 },
      { title: 'Hazard Ratio Forest Plot', points: ['HR 0.71 (95% CI 0.60–0.84)', 'Consistent across PD-L1 subgroups'], startSeconds: 70 },
      { title: 'Conclusion', points: ['New second-line standard of care', 'Grade 3+ toxicity in 28%'], startSeconds: 104 },
    ],
    transcript: [
      { startSeconds: 0, endSeconds: 16, text: 'Patients whose lung adenocarcinoma progresses on first-line therapy have few effective options.' },
      { startSeconds: 16, endSeconds: 32, text: 'We hypothesised that combining PD-1 and CTLA-4 blockade would overcome acquired resistance.' },
      { startSeconds: 32, endSeconds: 52, text: 'Across 612 patients, median overall survival was 14.2 months versus 9.8 months with docetaxel.' },
      { startSeconds: 52, endSeconds: 70, text: 'The Kaplan-Meier curves separate at month four and stay apart through two years.' },
      { startSeconds: 70, endSeconds: 88, text: 'The hazard ratio was 0.71 with a 95% confidence interval from 0.60 to 0.84.' },
      { startSeconds: 88, endSeconds: 104, text: 'The benefit held across PD-L1 expression subgroups in the forest plot.' },
      { startSeconds: 104, endSeconds: 128, text: 'Grade three or higher toxicity occurred in 28% of patients, which we consider manageable.' },
    ],
  },
}

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'methodologicalRigor',
    label: 'Methodological rigor & cohort size',
    description: 'Is the design sound and the cohort large enough to answer the question?',
    weight: 0.3,
  },
  {
    id: 'scientificOriginality',
    label: 'Scientific originality & novelty',
    description: 'Does the work add something new to the field?',
    weight: 0.25,
  },
  {
    id: 'statisticalProof',
    label: 'Statistical proof & clarity of results',
    description: 'Are the analyses appropriate and the results clearly reported?',
    weight: 0.25,
  },
  {
    id: 'clinicalSignificance',
    label: 'Clinical / real-world impact',
    description: 'Will the findings change practice or patient outcomes?',
    weight: 0.2,
  },
]

export const DEFAULT_RUBRIC_SCORES: RubricScores = {
  methodologicalRigor: 3,
  scientificOriginality: 3,
  statisticalProof: 3,
  clinicalSignificance: 3,
}

export const SCORE_LABELS = ['Poor', 'Weak', 'Adequate', 'Strong', 'Excellent'] as const

export const INITIAL_ANNOTATIONS: TimestampAnnotation[] = [
  { id: 'note-1', seconds: 42, slideIndex: 1, text: 'Baseline demographics table shows unbalanced staging.' },
  { id: 'note-2', seconds: 74, slideIndex: 2, text: 'Please clarify whether Kaplan-Meier error bands reflect SEM or 95% CI.' },
]

export const FEEDBACK_CUES = [
  'What was the strongest point of the study?',
  'What critical revision is needed?',
  'What is the tone of your recommendation?',
] as const

export const TONE_DICTIONARY: TonePhrase[] = [
  { phrase: 'The authors clearly fail to', suggestion: 'The authors should consider clarifying' },
  { phrase: 'clearly do not understand', suggestion: 'should clarify the rationale for' },
  { phrase: 'This is wrong', suggestion: 'This may need to be revisited' },
  { phrase: 'obviously flawed', suggestion: 'would benefit from further validation' },
  { phrase: 'makes no sense', suggestion: 'is difficult to follow and could be explained further' },
  { phrase: 'is useless', suggestion: 'adds limited value in its current form' },
  { phrase: 'sloppy', suggestion: 'could be presented more carefully' },
  { phrase: 'unacceptable', suggestion: 'falls short of the journal’s reporting standards' },
]

export const WARMTH_WORDS = ['thank', 'appreciate', 'strength', 'promising', 'commend', 'valuable', 'interesting', 'well', 'clear', 'important']

export const ACTION_WORDS = ['should', 'consider', 'recommend', 'suggest', 'please', 'could', 'clarify', 'provide', 'add', 'report']

export const DICTATION_SAMPLE =
  'Thank you for a clearly presented trial. The survival benefit is promising, but the authors should report the 95% confidence interval for each Kaplan-Meier estimate and clarify how missing follow-up data were handled.'
