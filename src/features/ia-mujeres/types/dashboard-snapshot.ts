export type SnapshotStatus = 'ok' | 'stale' | 'partial' | 'error'
export type SnapshotSourceProvider = 'mock' | 'twenty' | 'custom'
export type AlertLevel = 'info' | 'warning' | 'critical'
export type StageSemantic =
  | 'neutral'
  | 'active'
  | 'success'
  | 'warning'
  | 'danger'
  | 'future'
  | 'unknown'

export type WarningCode =
  | 'UNKNOWN_STAGE'
  | 'MISSING_FIELD'
  | 'DERIVED_METRIC'
  | 'RUNTIME_SCHEMA_UNVERIFIED'
  | 'CRM_UNAVAILABLE'
  | 'PARTIAL_DATA'
  | 'MOCK_DATA'
  | 'TASKS_TRUNCATED'
  | 'OPPORTUNITIES_TRUNCATED'

export type IaMujeresDashboardSnapshot = {
  schemaVersion: string
  generatedAt: string
  status: SnapshotStatus
  source: {
    crmProvider: SnapshotSourceProvider
    campaignKey: string
    recordsRead?: number
    runtimeVerified?: boolean
    lastSuccessfulRefreshAt?: string
    dataMode?: 'mock' | 'crm'
    crmConfigured?: boolean
    lastError?: string
    schemaDiscovery?: {
      status: 'not_run' | 'available' | 'missing_env' | 'failed'
      summaryPath?: string
    }
  }
  totals: {
    opportunities: number
    companies: number
    people: number
    notSent: number
    draftCreated: number
    outreachAttempts: number
    email1Sent: number
    sentWithoutBounce: number
    bouncesDetected: number
    repliesDetected: number
    meetingProposed: number
    meetingScheduled: number
    manualReview: number
    openTasks: number
    overdueTasks: number
    dueTodayTasks: number
    followupsPending: number
  }
  technicalEmailOutcomes?: {
    attempted: number
    sentWithoutBounce: number
    bounceOrManualReviewIncidents: number
    notes?: string
  }
  funnelStages: Array<{
    key: string
    label: string
    count: number
    percentage: number
    order: number
    semantic: StageSemantic
  }>
  kpiCards: Array<{
    key: string
    title: string
    value: string | number
    helper?: string
    trend?: {
      direction: 'up' | 'down' | 'flat'
      value: number
      label: string
    }
  }>
  alerts: Array<{
    id: string
    level: AlertLevel
    title: string
    description: string
    actionLabel?: string
    href?: string
  }>
  tasks: Array<DashboardTask>
  opportunities: Array<DashboardOpportunity>
  batches?: Array<{
    id: string
    label: string
    sentAt?: string
    sentCount: number
    bounceCount: number
    replyCount: number
    status: string
  }>
  warnings: Array<{
    code: WarningCode
    message: string
    count?: number
    source?: 'mock' | 'crm' | 'derived' | 'schema'
  }>
}

export type DashboardTask = {
  id: string
  title: string
  status: 'open' | 'done' | 'overdue' | 'blocked' | string
  dueAt?: string
  owner?: string
  category?: 'followup' | 'manual_review' | 'meeting' | 'data_quality' | 'other'
  relatedOpportunity?: {
    id: string
    name: string
  }
  relatedCompany?: {
    id: string
    name: string
  }
}

export type DashboardOpportunity = {
  id: string
  name: string
  companyName?: string
  commercialStage: string
  commercialStageLabel: string
  outreachStatus?: string
  technicalEmailOutcome?: 'not_attempted' | 'sent_without_bounce' | 'bounced' | 'manual_review' | 'unknown'
  owner?: string
  lastContactAt?: string
  nextActionAt?: string
  nextActionLabel?: string
  manualReviewReason?: string
  territory?: string
  entityType?: string
  icp?: string
}
