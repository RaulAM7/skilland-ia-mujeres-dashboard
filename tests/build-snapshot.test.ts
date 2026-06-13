import { describe, expect, it } from 'vitest'
import type {
  IaMujeresCrmRepository,
  RawIaMujeresOpportunity,
  RawIaMujeresTask,
} from '../server/crm/ia-mujeres-crm-repository'
import { MockIaMujeresRepository } from '../server/crm/mock-ia-mujeres-repository'
import { buildIaMujeresSnapshot } from '../server/ia-mujeres/build-snapshot'

describe('buildIaMujeresSnapshot', () => {
  it('returns the validated mock snapshot', async () => {
    const snapshot = await buildIaMujeresSnapshot({
      repository: new MockIaMujeresRepository(),
      campaignKey: 'ia-mujeres',
    })

    expect(snapshot.status).toBe('ok')
    expect(snapshot.totals.opportunities).toBe(100)
    expect(snapshot.totals.notSent).toBe(70)
    expect(snapshot.totals.sentWithoutBounce).toBe(28)
    expect(snapshot.totals.openTasks).toBe(30)
  })

  it('returns a valid empty snapshot when the repository has no records', async () => {
    const snapshot = await buildIaMujeresSnapshot({
      repository: createRepository(),
      campaignKey: 'ia-mujeres',
      provider: 'custom',
      runtimeVerified: true,
    })

    expect(snapshot.status).toBe('ok')
    expect(snapshot.totals).toMatchObject({
      opportunities: 0,
      companies: 0,
      people: 0,
      openTasks: 0,
      overdueTasks: 0,
      dueTodayTasks: 0,
      followupsPending: 0,
    })
    expect(snapshot.funnelStages).toEqual([])
    expect(snapshot.tasks).toEqual([])
    expect(snapshot.opportunities).toEqual([])
    expect(snapshot.warnings).toEqual([])
  })

  it('marks unknown raw stages as partial and emits a safe warning', async () => {
    const snapshot = await buildIaMujeresSnapshot({
      repository: createRepository({
        opportunities: [
          {
            id: 'opp-unknown',
            name: 'Entidad Demo',
            companyName: 'Entidad Demo',
            iaMujeresFunnelStage: 'SOMETHING_NEW',
            technicalEmailOutcome: 'manual_review',
          },
        ],
      }),
      campaignKey: 'ia-mujeres',
      provider: 'custom',
      runtimeVerified: true,
    })

    expect(snapshot.status).toBe('partial')
    expect(snapshot.totals.opportunities).toBe(1)
    expect(snapshot.opportunities[0]).toMatchObject({
      commercialStage: 'UNKNOWN_STAGE',
      technicalEmailOutcome: 'manual_review',
    })
    expect(snapshot.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'UNKNOWN_STAGE',
          count: 1,
        }),
      ]),
    )
  })
})

function createRepository(params?: {
  opportunities?: RawIaMujeresOpportunity[]
  tasks?: RawIaMujeresTask[]
}) {
  const opportunities = params?.opportunities ?? []
  const tasks = params?.tasks ?? []

  return {
    async listCampaignOpportunities() {
      return opportunities
    },
    async listCampaignTasks() {
      return tasks
    },
    async listCampaignCompanies() {
      return []
    },
    async listCampaignPeople() {
      return []
    },
  } satisfies IaMujeresCrmRepository
}
