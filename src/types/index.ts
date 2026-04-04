export type UserRole = 'osoba_s_postizenim' | 'pecujici' | 'organizace' | 'admin'
export type AccountType = 'individual' | 'organization'
export type SeverityLevel = 'lehka' | 'stredni' | 'tezsi'
export type DifficultyLevel = 'lehka' | 'stredni' | 'tezsi'
export type ExerciseStatus = 'generated' | 'awaiting_review' | 'approved' | 'rejected' | 'archived'
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled'
export type SubscriptionTier = 'individual' | 'institutional'
export type BatchStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Profile {
  id: string
  account_type: AccountType
  role: UserRole
  severity_level: SeverityLevel | null
  organization_name: string | null
  contact_info: string | null
  free_workbook_used: boolean
  created_at: string
  updated_at: string
}

export interface AssessmentResponse {
  id: string
  user_id: string
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
  q6: number
  q7: number
  average_score: number
  computed_severity: SeverityLevel
  is_current: boolean
  created_at: string
}

export interface Theme {
  id: string
  name: string
  description: string | null
  cover_image_url: string | null
  created_at: string
}

export interface CognitiveTag {
  id: string
  name: string
  label_cs: string
}

export interface Exercise {
  id: string
  theme_id: string
  difficulty: DifficultyLevel
  status: ExerciseStatus
  text_content: string
  image_url: string | null
  batch_id: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
}

export interface ExerciseWithTags extends Exercise {
  tags: CognitiveTag[]
  theme?: Theme
}

export interface Workbook {
  id: string
  user_id: string
  theme_id: string
  difficulty: DifficultyLevel
  pdf_url: string
  seed: number
  created_at: string
}

export interface WorkbookWithDetails extends Workbook {
  theme?: Theme
  exercises?: Exercise[]
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface GenerationBatch {
  id: string
  theme_id: string
  difficulty: DifficultyLevel
  cognitive_tag_ids: string[]
  count: number
  prompt_text: string
  prompt_image: string | null
  status: BatchStatus
  created_by: string
  created_at: string
}

export interface ErrorLog {
  id: string
  batch_id: string | null
  error_type: string
  error_message: string
  request_payload: Record<string, unknown> | null
  retryable: boolean
  retried: boolean
  created_at: string
}

// Assessment form questions
export interface AssessmentQuestion {
  id: string
  dimension: 'memory' | 'orientation' | 'attention' | 'language' | 'independence'
  text_first_person: string
  text_third_person: string
  options: { value: number; label_first_person: string; label_third_person: string }[]
}
