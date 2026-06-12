import type { IaMujeresDashboardSnapshot } from '../../src/features/ia-mujeres/types/dashboard-snapshot'
import type {
  IaMujeresCrmRepository,
  SnapshotBackedRepository,
} from '../crm/ia-mujeres-crm-repository'
import { buildFunnelStages, buildTotals } from './metrics'
import { normalizeOpportunity } from './normalize-opportunities'
import { normalizeTask } from './normalize-tasks'
import { iaMujeresDashboardSnapshotSchema } from './snapshot-schema'
import { isKnownStage } from './stage-mapping'

export async function buildIaMujeresSnapshot(params: {
  repository: IaMujeresCrmRepository
  campaignKey: string
}): Promise<IaMujeresDashboardSnapshot> {
  if (isSnapshotBackedRepository(params.repository)) {
    return iaMujeresDashboardSnapshotSchema.parse(await params.repository.getSnapshot())
  }

  const [rawOpportunities, rawTasks, rawCompanies, rawPeople] = await Promise.all([
    params.repository.listCampaignOpportunities({ campaignKey: params.campaignKey }),
    params.repository.listCampaignTasks({ campaignKey: params.campaignKey }),
    params.repository.listCampaignCompanies?.({ campaignKey: params.campaignKey }) ?? Promise.resolve([]),
    params.repository.listCampaignPeople?.({ campaignKey: params.campaignKey }) ?? Promise.resolve([]),
  ])

  const opportunities = rawOpportunities.map(normalizeOpportunity)
  const tasks = rawTasks.map(normalizeTask)
  const unknownStageCount = rawOpportunities.filter(
    (opportunity) => !isKnownStage(opportunity.commercialStage ?? opportunity.iaMujeresFunnelStage),
  ).length
  const totals = {
    ...buildTotals(opportunities, tasks),
    companies: rawCompanies.length || buildTotals(opportunities, tasks).companies,
    people: rawPeople.length,
  }

  const snapshot: IaMujeresDashboardSnapshot = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    status: unknownStageCount > 0 ? 'partial' : 'ok',
    source: {
      crmProvider: 'custom',
      campaignKey: params.campaignKey,
      recordsRead: rawOpportunities.length + rawTasks.length + rawCompanies.length + rawPeople.length,
      runtimeVerified: false,
      dataMode: 'crm',
    },
    totals,
    funnelStages: buildFunnelStages(opportunities),
    kpiCards: [
      { key: 'opportunities', title: 'Oportunidades', value: totals.opportunities },
      { key: 'not_sent', title: 'Sin contactar', value: totals.notSent },
      { key: 'sent_without_bounce', title: 'Enviados sin bounce', value: totals.sentWithoutBounce },
      { key: 'manual_review', title: 'Revision manual', value: totals.manualReview },
    ],
    alerts: [],
    tasks,
    opportunities,
    warnings: unknownStageCount
      ? [
          {
            code: 'UNKNOWN_STAGE',
            message: 'Hay oportunidades con stage no reconocido.',
            count: unknownStageCount,
            source: 'schema',
          },
        ]
      : [],
  }

  return iaMujeresDashboardSnapshotSchema.parse(snapshot)
}

export function createErrorSnapshot(params: {
  campaignKey: string
  message: string
  provider?: 'mock' | 'twenty' | 'custom'
}): IaMujeresDashboardSnapshot {
  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    status: 'error',
    source: {
      crmProvider: params.provider ?? 'twenty',
      campaignKey: params.campaignKey,
      runtimeVerified: false,
      dataMode: params.provider === 'mock' ? 'mock' : 'crm',
    },
    totals: {
      opportunities: 0,
      companies: 0,
      people: 0,
      notSent: 0,
      draftCreated: 0,
      outreachAttempts: 0,
      email1Sent: 0,
      sentWithoutBounce: 0,
      bouncesDetected: 0,
      repliesDetected: 0,
      meetingProposed: 0,
      meetingScheduled: 0,
      manualReview: 0,
      openTasks: 0,
      overdueTasks: 0,
      dueTodayTasks: 0,
      followupsPending: 0,
    },
    funnelStages: [],
    kpiCards: [],
    alerts: [
      {
        id: 'snapshot-error',
        level: 'critical',
        title: 'No se pudo generar el snapshot',
        description: params.message,
      },
    ],
    tasks: [],
    opportunities: [],
    warnings: [
      {
        code: 'CRM_UNAVAILABLE',
        message: params.message,
        source: 'crm',
      },
    ],
  }
}

function isSnapshotBackedRepository(repository: IaMujeresCrmRepository): repository is SnapshotBackedRepository {
  return 'getSnapshot' in repository && typeof repository.getSnapshot === 'function'
}
