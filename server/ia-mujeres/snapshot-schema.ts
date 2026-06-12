import { z } from 'zod'

const statusSchema = z.enum(['ok', 'stale', 'partial', 'error'])
const sourceProviderSchema = z.enum(['mock', 'twenty', 'custom'])
const semanticSchema = z.enum(['neutral', 'active', 'success', 'warning', 'danger', 'future', 'unknown'])
const warningCodeSchema = z.enum([
  'UNKNOWN_STAGE',
  'MISSING_FIELD',
  'DERIVED_METRIC',
  'RUNTIME_SCHEMA_UNVERIFIED',
  'CRM_UNAVAILABLE',
  'PARTIAL_DATA',
  'MOCK_DATA',
  'TASKS_TRUNCATED',
  'OPPORTUNITIES_TRUNCATED',
])

const relatedEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const dashboardTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  dueAt: z.string().optional(),
  owner: z.string().optional(),
  category: z.enum(['followup', 'manual_review', 'meeting', 'data_quality', 'other']).optional(),
  relatedOpportunity: relatedEntitySchema.optional(),
  relatedCompany: relatedEntitySchema.optional(),
})

export const dashboardOpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string().optional(),
  commercialStage: z.string(),
  commercialStageLabel: z.string(),
  outreachStatus: z.string().optional(),
  technicalEmailOutcome: z.enum(['not_attempted', 'sent_without_bounce', 'bounced', 'manual_review', 'unknown']).optional(),
  owner: z.string().optional(),
  lastContactAt: z.string().optional(),
  nextActionAt: z.string().optional(),
  nextActionLabel: z.string().optional(),
  manualReviewReason: z.string().optional(),
  territory: z.string().optional(),
  entityType: z.string().optional(),
  icp: z.string().optional(),
})

export const iaMujeresDashboardSnapshotSchema = z.object({
  schemaVersion: z.string(),
  generatedAt: z.string(),
  status: statusSchema,
  source: z.object({
    crmProvider: sourceProviderSchema,
    campaignKey: z.string(),
    recordsRead: z.number().optional(),
    runtimeVerified: z.boolean().optional(),
    lastSuccessfulRefreshAt: z.string().optional(),
    dataMode: z.enum(['mock', 'crm']).optional(),
  }),
  totals: z.object({
    opportunities: z.number(),
    companies: z.number(),
    people: z.number(),
    notSent: z.number(),
    draftCreated: z.number(),
    outreachAttempts: z.number(),
    email1Sent: z.number(),
    sentWithoutBounce: z.number(),
    bouncesDetected: z.number(),
    repliesDetected: z.number(),
    meetingProposed: z.number(),
    meetingScheduled: z.number(),
    manualReview: z.number(),
    openTasks: z.number(),
    overdueTasks: z.number(),
    dueTodayTasks: z.number(),
    followupsPending: z.number(),
  }),
  technicalEmailOutcomes: z
    .object({
      attempted: z.number(),
      sentWithoutBounce: z.number(),
      bounceOrManualReviewIncidents: z.number(),
      notes: z.string().optional(),
    })
    .optional(),
  funnelStages: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      count: z.number(),
      percentage: z.number(),
      order: z.number(),
      semantic: semanticSchema,
    }),
  ),
  kpiCards: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      value: z.union([z.string(), z.number()]),
      helper: z.string().optional(),
      trend: z
        .object({
          direction: z.enum(['up', 'down', 'flat']),
          value: z.number(),
          label: z.string(),
        })
        .optional(),
    }),
  ),
  alerts: z.array(
    z.object({
      id: z.string(),
      level: z.enum(['info', 'warning', 'critical']),
      title: z.string(),
      description: z.string(),
      actionLabel: z.string().optional(),
      href: z.string().optional(),
    }),
  ),
  tasks: z.array(dashboardTaskSchema),
  opportunities: z.array(dashboardOpportunitySchema),
  batches: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        sentAt: z.string().optional(),
        sentCount: z.number(),
        bounceCount: z.number(),
        replyCount: z.number(),
        status: z.string(),
      }),
    )
    .optional(),
  warnings: z.array(
    z.object({
      code: warningCodeSchema,
      message: z.string(),
      count: z.number().optional(),
      source: z.enum(['mock', 'crm', 'derived', 'schema']).optional(),
    }),
  ),
})

export type IaMujeresDashboardSnapshotFromSchema = z.infer<typeof iaMujeresDashboardSnapshotSchema>
