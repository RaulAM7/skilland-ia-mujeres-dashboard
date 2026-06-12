# Dashboard Snapshot Contract — 2026-06-12

## Purpose
The snapshot is a compact, UI-ready representation of IA Mujeres funnel state. It is not a CRM dump and must not contain secrets, full email bodies or unnecessary personal data.

## TypeScript-Style Contract

```ts
export type SnapshotStatus = 'ok' | 'stale' | 'partial' | 'error'
export type SnapshotSourceProvider = 'mock' | 'twenty' | 'custom'
export type AlertLevel = 'info' | 'warning' | 'critical'

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
    semantic: 'neutral' | 'active' | 'success' | 'warning' | 'danger' | 'future' | 'unknown'
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

  tasks: Array<{
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
  }>

  opportunities: Array<{
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
  }>

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
```

## Source Values
- `mock`: local/development data, no CRM dependency.
- `twenty`: deployed Twenty CRM API.
- `custom`: future read-only custom endpoint if Twenty API is insufficient.

## Known Fields From Source Docs
These fields are source-confirmed but runtime-unverified until the deployed API is checked:

- `iaMujeresFunnelStage`
- `outreachStatus`
- `firstEmailSentAt`
- `lastEmailSentAt`
- `lastReplyAt`
- `followUpDueAt`
- `gmailDraftId`
- `gmailMessageId`
- `gmailThreadId`
- `lastEmailEventAt`
- `lastEmailEventType`
- `activeBatchId`
- `needsManualReview`
- `duplicatePossible`
- `genericEmail`

## Possible Unconfirmed Fields
These may be useful but must not be treated as confirmed:

- `manualReviewReason`
- `territory`
- `entityType`
- `icp`
- `owner`
- `subIcp`
- `copyVariant`
- `bounceReason`
- `replyDetectedAt`
- exact task relation names

## Unknown Stage Handling
- Stage mapping must be centralized.
- Unknown CRM stage values map to `UNKNOWN_STAGE`.
- Unknown stages must render in the UI.
- Snapshot must include `UNKNOWN_STAGE` warning with count.

## Empty And Error States
- Empty CRM result: return `status: 'ok'`, zero totals and empty arrays if the query itself succeeded.
- CRM unavailable: return `status: 'error'` unless a cache exists in a later phase.
- Partial data: return `status: 'partial'`, include available sections and emit warnings.
- Schema mismatch: return `status: 'partial'` or `error` depending on severity; never throw raw payloads to UI.

## Data Minimization Rules
- Do not include CRM API keys, refresh secrets, cron secrets or env values.
- Do not include full email bodies.
- Avoid personal email addresses in the snapshot.
- Prefer organization, stage, owner label and next action over person-level data.
- Debug panels may show raw snapshot only in local/dev and never secrets.
